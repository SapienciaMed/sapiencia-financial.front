import React from 'react'
import TabAddFundsPage from './tab-add-funds.page';

function AddFundsCrudPage() {
    
    return (
        <div className="crud-page full-height">
            <section className="main-page full-height">
                <div className="card-table">
                    <p className="text-black extra-large">
                        Añadir valores
                    </p>

                    <TabAddFundsPage/>

                </div>
            </section>
        </div>
    )
}

export default React.memo(AddFundsCrudPage);