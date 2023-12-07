import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { getUserFragmentMetaById, getUserFragmentDataById } from '../api';
import { getUser } from '../auth';

export default function GetById() {
    const { control, handleSubmit } = useForm();
    const [fragmentMeta, setFragmentMeta] = useState(null);
    const [fragmentData, setFragmentData] = useState(null);

    const onSubmitMetaData = async (data) => {
        try {
            const user = await getUser();
            const id = data.id.trim();
            const result = await getUserFragmentMetaById(user, id);
            setFragmentMeta(result);
            setFragmentData(null); // clear previous data
        } catch (err) {
            console.error(err);
            setFragmentMeta(null);
        }
    };

    const onSubmitData = async (data) => {
        try {
            const user = await getUser();
            const id = data.id.trim();
            const result = await getUserFragmentDataById(user, id);
            setFragmentData(result);
            setFragmentMeta(null); // clear previous metadata
        } catch (err) {
            console.error(err);
            setFragmentData(null);
        }
    };

    function renderFragmentData(fragmentData) {
        console.log(fragmentData.type.startsWith('image/'), "is starts with")
        switch (fragmentData.type) {
            case 'application/json':
                return <p><strong>Data (JSON):</strong> {JSON.stringify(fragmentData.data, null, 2)}</p>;
            case 'image/jpeg':
            case 'image/jpg':
                let imageUrljpg = URL.createObjectURL(fragmentData.data);
                return <div><strong>Data (image/jpeg):</strong><img src={imageUrljpg} alt="Fragment" className="mt-2" /></div>;

            case 'image/png':
                let imageUrlpng = URL.createObjectURL(fragmentData.data);
                return <div><strong>Data (image/png):</strong><img src={imageUrlpng} alt="Fragment" className="mt-2" /></div>;

            case 'image/gif':
                let imageUrlgif = URL.createObjectURL(fragmentData.data);
                return <div><strong>Data (image/gif):</strong><img src={imageUrlgif} alt="Fragment" className="mt-2" /></div>;

            case 'image/webp':
                let imageUrlwebp = URL.createObjectURL(fragmentData.data);
                return <div><strong>Data (image/webp):</strong><img src={imageUrlwebp} alt="Fragment" className="mt-2" /></div>;
                
            case 'text/plain':
                return <div><strong>Data (Text):</strong> <p>{fragmentData.data}</p></div>;
            case 'text/markdown':                
                return <div><strong>Data (Markdown):</strong> <p>{fragmentData.data}</p></div>;
            case 'text/html':
                return <div><strong>Data (html):</strong> <p>{fragmentData.data}</p></div>;
            default:
                return <p>Unsupported data type</p>;
        }
    }

    return (
        <div className="flex flex-col items-start">
            <form className='w-1/2'>
                <div className="mb-3">
                    <Controller
                        name="id"
                        control={control}
                        defaultValue=""
                        rules={{
                            required: true,
                        }}
                        render={({ field }) => <input {...field} placeholder="Fragment ID" className="p-5 rounded-xl w-full" />}
                    />
                </div>
                <div className="space-x-5">
                    <button type="button" onClick={handleSubmit(onSubmitData)} className='mt-5 rounded-full bg-emerald-400 hover:bg-emerald-600 py-3 px-8 font-bold shadow-lg hover:shadow-md'>Get Data</button>
                    <button type="button" onClick={handleSubmit(onSubmitMetaData)} className='mt-5 rounded-full bg-emerald-400 hover:bg-emerald-600 py-3 px-8 font-bold shadow-lg hover:shadow-md'>Get MetaData</button>
                </div>
            </form>

            {fragmentMeta && (
                <div className="p-4 m-2 border rounded-lg mt-5">
                    <p><strong>ID:</strong> {fragmentMeta.id}</p>
                    <p><strong>Owner ID:</strong> {fragmentMeta.ownerId}</p>
                    <p><strong>Created:</strong> {fragmentMeta.created}</p>
                    <p><strong>Updated:</strong> {fragmentMeta.updated}</p>
                    <p><strong>Type:</strong> {fragmentMeta.type}</p>
                    <p><strong>Size:</strong> {fragmentMeta.size}</p>
                </div>
            )}
            {fragmentData && (
                <div className="p-4 m-2 border rounded-lg mt-5">
                    {renderFragmentData(fragmentData)}
                </div>
            )}
        </div>
    );
}

