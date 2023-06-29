interface IRowTableProps {
    title: string;
    value: string;
}

interface IDetailsProps {
    rows: IRowTableProps[]
}

function DetailsComponent({ rows }: IDetailsProps): React.JSX.Element {
    return (
        <table className="details-table">
            {rows.map(row => {
                return (
                    <tr key={row.title}>
                        <th className="th-title">{row.title}</th>
                        <th className="th-content">{row.value}</th>
                    </tr>
                )
            })}
        </table>
    );
}

export default DetailsComponent;