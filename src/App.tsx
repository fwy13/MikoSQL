import { motion } from "framer-motion";
import EditorQuery from "./components/EditorQuery";
import { useState } from "react";
import {
    Button,
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";

const variants = {
    hidden: { opacity: 0, x: 0, y: 20 },
    enter: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, x: -0, y: 20 },
};

const App = () => {
    const [IsCode, setIsCode] = useState<string | undefined>();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [IsTable, setIsTable] = useState<any[]>();
    const [IsErr, setIsErr] = useState<string>();
    const [IsLoading, setIsLoading] = useState<boolean>(false);
    const Handler = async () => {
        setIsLoading(true);
        await fetch(
            `https://mikosqlserver.onrender.com/query=${encodeURIComponent(
                IsCode!
            )}`
        )
            .then((res) => res.json())
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .then((data: any) => {
                setIsLoading(false);
                if (data.message) {
                    setIsErr(data.message);
                } else {
                    setIsTable(data);
                }
                console.log(data);
            });
    };
    return (
        <main className="flex justify-cente w-full flex-col ">
            <EditorQuery Code={setIsCode} />
            <Button className="p-3 w-[150px] gap-2" onClick={Handler}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
                    />
                </svg>
                Run
            </Button>
            <div className="grid mt-5 text-white justify-center">
                {IsTable && IsErr !== "" ? (
                    <motion.article
                        initial="hidden"
                        animate="enter"
                        exit="exit"
                        variants={variants}
                        transition={{ duration: 0.4, type: "easeInOut" }}
                        style={{ position: "relative" }}
                    >
                        <TableContainer>
                            <Table>
                                <Thead>
                                    <Tr>
                                        {Object.keys(IsTable[0]).map(
                                            (item: string, index: number) => (
                                                <Th key={index}>{item}</Th>
                                            )
                                        )}
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {IsTable.map((item, index: number) => (
                                        <Tr key={index}>
                                            {Object.keys(item).map(
                                                (el: string, index: number) => (
                                                    <Td
                                                        key={index}
                                                        className="text-center items-center"
                                                    >
                                                        {item[`${el}`]}
                                                    </Td>
                                                )
                                            )}
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </motion.article>
                ) : (
                    <div>
                        {IsErr ? (
                            <span className="p-2 text-red-500">
                                LỖI: {IsErr}
                            </span>
                        ) : (
                            <div>
                                {IsLoading ? (
                                    <div role="status">
                                        <svg
                                            aria-hidden="true"
                                            className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                                            viewBox="0 0 100 101"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                                fill="currentColor"
                                            />
                                            <path
                                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                                fill="currentFill"
                                            />
                                        </svg>
                                        <span className="sr-only">
                                            Loading...
                                        </span>
                                    </div>
                                ) : (
                                    <span>
                                        Hãy soạn câu truy vấn ở bảng trên. Hiện
                                        tại chưa có kết quả.
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
            <footer className="text-white fixed bottom-0">Credit: <a href="https://www.facebook.com/lolis.bigboobs/">WYN2404</a> (quy66052@gmail.com) or <a href="https://github.com/wyn2404">Github.</a></footer>
        </main>
    );
};

export default App;
