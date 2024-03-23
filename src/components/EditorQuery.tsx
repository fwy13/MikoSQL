import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Editor, useMonaco } from "@monaco-editor/react";
import language from "../Utils/sql";
import { format } from "sql-formatter";

const EditorSQL = ({
    Code,
}: {
    Code: Dispatch<SetStateAction<string | undefined>>;
}) => {
    const monaco = useMonaco();
    const [isParam, setIsParam] = useState(false);
    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function createDependencyProposals(sugs: any) {
            if (!isParam) {
                return sugs;
            } else {
                if (monaco) {
                    return {
                        label: "param1",
                        kind: monaco.languages.CompletionItemKind.Function,
                        insertText: "param1}}",
                    };
                }
            }
        }
        if (monaco) {
            monaco.languages.register({ id: "SQLMIKO" });

            const sugsArr = [
                ...language.keywords,
                ...language.operators,
                ...language.builtinFunctions,
            ];
            monaco.languages.registerCompletionItemProvider("SQLMIKO", {
                provideCompletionItems: function () {
                    const sugs = sugsArr.map((sug) => {
                        return {
                            label: sug,
                            kind: monaco.languages.CompletionItemKind.Property,
                            insertText: sug.toUpperCase(),
                        };
                    });
                    return {
                        suggestions: createDependencyProposals(sugs),
                    };
                },
            });
            monaco.editor.defineTheme("myCustomTheme", {
                base: "vs", // can also be vs-dark or hc-black
                inherit: false, // can also be false to completely replace the builtin rules
                rules: [
                    {
                        token: "keyword.sql",
                        foreground: "008800",
                        fontStyle: "bold",
                    },
                    {
                        token: "operator.sql",
                        foreground: "008800",
                        fontStyle: "bold",
                    },
                    {
                        token: "builtinFunctions.sql",
                        foreground: "008800",
                        fontStyle: "bold",
                    },
                ],
                colors: {
                    "editor.foreground": "#000000",
                },
            });
        }
    }, [monaco, isParam]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function handleEditorDidMount(editor: any) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        editor.getModel().onDidChangeContent((event: any) => {
            const pos = editor
                .getModel()
                .getPositionAt(event.changes[0].rangeOffset);
            const range = {
                startLineNumber: pos.lineNumber,
                startColumn: pos.column - 1,
                endLineNumber: pos.lineNumber,
                endColumn: pos.column + 1,
            };
            const word = editor.getModel().getValueInRange(range);
            if (word === "{{") {
                setIsParam(true);
                // isParam = true;
            } else {
                setIsParam(false);
                // isParam = false;
            }
        });
    }

    return (
        <Editor
            height={360}
            defaultLanguage="SQLMIKO"
            className="p-2"
            theme="vs-dark"
            onChange={(code) => {
                Code(format(code!, { language: 'mysql' }));
                // console.log(format(code!, { language: 'mysql' }))
            }}
            onMount={handleEditorDidMount}
        />
    );
};

export default EditorSQL;
