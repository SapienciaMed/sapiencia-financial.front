
interface IRowTableProps {
    id: number,
    project:  {
        title: string;
        value: string;
    }[]
}

interface IDetailsProps {
    rows: IRowTableProps[]
}

function DetailProjectTabComponent({ rows }: IDetailsProps) {
    return(
        <table className="details-table-project">
            {
               rows.map(row => {
                    return(
                        <div key={row.id} >
                            {
                                row.project.map(row2 => {
                                    return(
                                        <tr key={row2.title}>
                                            <th className="th-title">{row2.title}</th>
                                            <th className="th-content">{row2.value}</th>
                                        </tr>
                                    )
                                })
                            }
                        </div>
                    )
               })
            }
        </table>
    )

}

export default DetailProjectTabComponent;