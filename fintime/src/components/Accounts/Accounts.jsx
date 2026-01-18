import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  MeasuringStrategy
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
  useSortable,
  defaultAnimateLayoutChanges
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import Card from "../Card/Card";
import ConfirmModal from "../Modal/ConfirmModal";
import TransactionModal from "../Modal/TransactionModal";
import {
  getAccounts,
  deleteAccount,
  closeAccount,
  restoreAccount,
  income,
  expense,
  reorderAccounts
} from "../../api/api";

import styles from "./Accounts.module.css";

function customAnimateLayoutChanges(args) {
  if (args.isSorting || args.wasDragging) return defaultAnimateLayoutChanges(args);
  return true;
}

function SortableCard({ id, account, onDelete, onClose, onRestore, onIncome, onExpense, onClick }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    animateLayoutChanges: customAnimateLayoutChanges
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
    opacity: isDragging ? 0 : 1,
    visibility: isDragging ? "hidden" : "visible",
    zIndex: isDragging ? 1000 : 1,
    boxShadow: isDragging ? "0 20px 40px rgba(0,0,0,0.25)" : "none",
    borderRadius: "13px",
    height: "auto",
    width: "100%",
    pointerEvents: isDragging ? "none" : "auto",
    margin: "0",
    overflow: "visible",
    cursor: "pointer"
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} onClick={onClick}>
      <Card
        account={account}
        onDelete={onDelete}
        onClose={onClose}
        onRestore={onRestore}
        onIncome={onIncome}
        onExpense={onExpense}
      />
    </div>
  );
}

export default function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [modal, setModal] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const navigate = useNavigate();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {})
  );

  const loadAccounts = useCallback(async () => {
    try {
      const data = await getAccounts();
      setAccounts([...data].sort((a, b) => (a.account_position ?? 0) - (b.account_position ?? 0)));
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => { loadAccounts(); }, [loadAccounts]);

  const handleDragStart = (event) => setActiveId(event.active.id);
  const handleDragEnd = (event) => {
    setActiveId(null);
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setAccounts(items => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        const newOrder = arrayMove(items, oldIndex, newIndex);
        reorderAccounts(newOrder);
        return newOrder;
      });
    }
  };

  const activeAccount = accounts.find(acc => acc.id === activeId);

  return (
    <div className={styles.container}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
      >
        <SortableContext items={accounts.map(a => a.id)} strategy={rectSortingStrategy}>
          <div className={styles.grid}>
            {accounts.map(acc => (
              <SortableCard
                key={acc.id}
                id={acc.id}
                account={acc}
                onDelete={() => setModal({ type: "delete", acc })}
                onClose={() => setModal({ type: "close", acc })}
                onRestore={() => setModal({ type: "restore", acc })}
                onIncome={() => setModal({ type: "income", acc })}
                onExpense={() => setModal({ type: "expense", acc })}
                onClick={() => navigate(`/account/${acc.id}`)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Модалки */}
      {modal?.type === "delete" && (
        <ConfirmModal
          title="Удалить счёт"
          text={`Удалить "${modal.acc.account_name}"?`}
          onCancel={() => setModal(null)}
          onConfirm={() => { deleteAccount(modal.acc.id).then(loadAccounts); setModal(null); }}
        />
      )}
      {modal?.type === "close" && (
        <ConfirmModal
          title="Закрыть счёт"
          text={`Закрыть "${modal.acc.account_name}"?`}
          onCancel={() => setModal(null)}
          onConfirm={() => { closeAccount(modal.acc.id).then(loadAccounts); setModal(null); }}
        />
      )}
      {modal?.type === "restore" && (
        <ConfirmModal
          title="Восстановить счёт"
          text={`Восстановить "${modal.acc.account_name}"?`}
          onCancel={() => setModal(null)}
          onConfirm={() => { restoreAccount(modal.acc.id).then(loadAccounts); setModal(null); }}
        />
      )}
      {modal?.type === "income" && (
        <TransactionModal
          title="Пополнение счёта"
          onCancel={() => setModal(null)}
          onSubmit={data => { income(modal.acc.id, data).then(loadAccounts); setModal(null); }}
        />
      )}
      {modal?.type === "expense" && (
        <TransactionModal
          title="Снятие со счёта"
          onCancel={() => setModal(null)}
          onSubmit={data => { expense(modal.acc.id, data).then(loadAccounts); setModal(null); }}
        />
      )}
    </div>
  );
}
