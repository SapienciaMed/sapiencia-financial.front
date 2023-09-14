import { IoIosArrowForward } from 'react-icons/io';
import icono from '../../../public/images/icons/icon-arrow.png'
import { ButtonComponent } from '../../../common/components/Form';

interface IRowTableProps {
    title: string,
    value: string,
    idListNameProject: string,
    id: string
}

interface IDetailsProps {
    rows: IRowTableProps[]
    total: number,
    onOk: () => void,
    onShowModalDetail: (title: string, idListNameProject: string, id: string) => void
}

function DetailsRouteValuesComponent({ rows, total, onOk, onShowModalDetail }: IDetailsProps): React.JSX.Element {

    const onTableRow = (title: string, idListNameProject: string, id: string) => {
        onOk()
        onShowModalDetail(title, idListNameProject, id)
    }

    return (
        <div className="display-flex-direction-column full-width">
            <label className="text-black large">Detalle de la ruta</label>

            <table className="details-table-2 card-grid-item">
                {
                    rows?.map((row, index) => {
                        return (
                            <tr key={row.title} onClick={() => onTableRow(row?.title, row.idListNameProject, row.id)}>
                                <th className="th-title">{row?.title}</th>
                                <th className="th-content">
                                    {row?.value}
                                    <IoIosArrowForward style={{color: '#533893'}}/>
                                </th>
                            </tr>
                        )
                    })
                }
            </table>

            <footer className='container-button-descripcion-modal'>
                <div className='content-label'>
                    <label className="text-black biggest"> Total Traslado:</label>
                    <label className="text-black biggest" style={{color: '#533893'}}> $ {total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} </label>
                </div>
                <div className="buttons-bot">
                    <ButtonComponent
                        className="button-main huge hover-three"
                        value="Aceptar"
                        action={onOk}
                    />
                </div>
            </footer>
        </div>
    );
}

export default DetailsRouteValuesComponent;