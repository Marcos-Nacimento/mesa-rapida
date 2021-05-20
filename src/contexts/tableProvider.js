import React, { createContext, useState } from 'react';

export const TableContext = createContext();

export default ({ children }) => {
    const [table, setTable] = useState({});

    return(
        <TableContext.Provider
            value={{
                table,
                setTable,
            }}
        >
            {children}
        </TableContext.Provider>
    );
};