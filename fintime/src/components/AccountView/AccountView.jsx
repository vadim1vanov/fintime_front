import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Accounts from "../Accounts/Accounts";

export default function AccountView(){
    const { loggedIn } = useContext(AuthContext);
    const [accounts, setAccounts] = useState([]);
    const [error, setError] = useState("");
    const [newAccountName, setNewAccountName] = useState("");
    const [newAccountBalance, setNewAccountBalance] = useState(0);
    const [newCurrency, setNewCurrency] = useState("RUB");
}