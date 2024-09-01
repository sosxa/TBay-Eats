'use client';
import React, { useEffect, useState } from 'react'
import ListRelatedCombos from './ListRelatedCombos'
import relatedComboData from './relatedComboData';

const HandleRelatedCombos = ({ productEmail, ogName }: { productEmail: string; ogName: string; }) => {
    const [comboData, setComboData] = useState<any[]>();
    const [loading, setLoading] = useState<boolean>(false);
    useEffect(() => {
        const getCombos = async () => {
            setLoading(true);
            const data = await relatedComboData(productEmail, ogName);
            setComboData(data);
            return;
        };

        getCombos().finally(() => setLoading(false));
    }, [productEmail, ogName]);
    return (
        <div className='w-auto'>
            {comboData && comboData.length > 0 && (
                <>
                    <aside className="hidden xl:block w-full space-y-6 px-4">
                        <ListRelatedCombos
                            relatedCombos={comboData}
                            loading={loading}
                        />
                    </aside>
                    <div className="xl:hidden space-y-6">
                        <ListRelatedCombos
                            relatedCombos={comboData}
                            loading={loading}
                        />
                    </div>
                </>
            )}
        </div>
    )
}

export default HandleRelatedCombos
