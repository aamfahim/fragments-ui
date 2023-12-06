import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { deleteUserFragment } from '../api';
import { getUser } from '../auth';

export default function Delete() {
    const { control, handleSubmit } = useForm();

    const onSubmitData = async (data) => {
        const user = await getUser();
        const id = data.id.trim();
        const res = await deleteUserFragment(user, id);
        console.log(res);
    };

    return (
        <div className="flex flex-col items-start">
            <form>
                <div className="mb-3">
                    <Controller
                        name="id"
                        control={control}
                        defaultValue=""
                        rules={{
                            required: true,
                        }}
                        render={({ field }) => <input {...field} placeholder="Fragment ID" className="p-5 rounded-xl w-96" />}
                    />
                </div>
                <div className="space-x-5">
                    <button type="button" onClick={handleSubmit(onSubmitData)} className='mt-5 rounded-full bg-red-600 hover:bg-red-700 py-3 px-8 font-bold shadow-lg hover:shadow-md'>Delete Fragment</button>
                </div>
            </form>

        </div>
    );
}
