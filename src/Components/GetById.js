import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { getUserFragmentById } from '@/api';
import { getUser } from '@/auth';

export default function GetById() {
    const { control, handleSubmit } = useForm();
    const [fragment, setFragment] = useState(null);

    const onSubmit = async (data) => {
        try {
            const user = await getUser();
            const result = await getUserFragmentById(user, data.id);
            setFragment(result);
        } catch (err) {
            console.error(err);
            setFragment(null); // clear any previous fragment
        }
    };

    return (
        <div className="flex flex-col items-start">
            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-xs">
                <div className="mb-3">
                    <Controller
                        name="id"
                        control={control}
                        defaultValue=""
                        render={({ field }) => <input {...field} placeholder="Fragment ID" className="p-5 rounded-xl w-full" />}
                    />
                </div>
                <button type="submit" className='mt-5 rounded-full bg-emerald-400 hover:bg-emerald-600 py-3 px-8 font-bold shadow-lg hover:shadow-md'>Get</button>
            </form>
            
            
            {fragment && (
                <div className="p-4 m-2 border rounded-lg mt-5">
                    <p><strong>ID:</strong> {fragment.id}</p>
                    <p><strong>Owner ID:</strong> {fragment.ownerId}</p>
                    <p><strong>Created:</strong> {fragment.created}</p>
                    <p><strong>Updated:</strong> {fragment.updated}</p>
                    <p><strong>Type:</strong> {fragment.type}</p>
                    <p><strong>Size:</strong> {fragment.size}</p>
                </div>
            )}
        </div>
    );
}
