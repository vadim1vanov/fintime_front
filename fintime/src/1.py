import os

def simple_collect_files():
    with open("all_files.txt", "w", encoding="utf-8") as output:
        for root, dirs, files in os.walk("."):
            for filename in files:
                if filename == "all_files.txt":
                    continue
                full_path = os.path.join(root, filename)
                rel_path = os.path.relpath(full_path, ".")
                output.write(f"Файл {rel_path}:\n")
                output.write("*" * 40 + "\n")
                try:
                    with open(full_path, "r", encoding="utf-8") as f:
                        output.write(f.read())
                except:
                    output.write("[НЕВОЗМОЖНО ПРОЧИТАТЬ ФАЙЛ]\n")
                output.write("\n" + "*" * 40 + "\n\n")

if __name__ == "__main__":
    simple_collect_files()
    print("Файлы собраны в all_files.txt")
