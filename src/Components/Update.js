import { updateUserFragment } from '../api';
import { getUser } from '../auth';
import React from 'react';
import { useForm, Controller } from 'react-hook-form';

export default function Update() {
    const { control, handleSubmit, watch } = useForm();
    const selectedType = watch("type");

    const onSubmit = async (data) => {
        const user = await getUser();
        const res = await updateUserFragment(user, data.id, data.type, data.input);
        console.log(res);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
                <Controller
                    name="id"
                    control={control}
                    defaultValue=""
                    rules={{
                        required: true,
                    }}
                    render={({ field }) => <input {...field} placeholder="Fragment ID" className="p-5 mb-3 rounded-xl w-96" />}
                />
                <br />
                <Controller
                    name="type"
                    control={control}
                    defaultValue="text/plain"
                    render={({ field }) => (
                        <select {...field} className="p-5 rounded-xl">
                            <option value="text/plain">text/plain</option>
                            <option value="text/markdown">text/markdown</option>
                            <option value="text/html">text/html</option>
                            <option value="application/json">application/json</option>
                            <option value="image/png">image/png</option>
                            <option value="image/jpeg">image/jpeg</option>
                            <option value="image/webp">image/webp</option>
                            <option value="image/gif">image/gif</option>
                        </select>
                    )}
                />
                {selectedType && selectedType.startsWith('image') ? (
                    <Controller
                        name="input"
                        control={control}
                        defaultValue=""
                        render={({ field }) => <input {...field} type="file" className="p-5 rounded-xl mt-2" />}
                    />
                ) : (
                    <Controller
                        name="input"
                        control={control}
                        defaultValue=""
                        render={({ field }) => <textarea {...field} className="p-5 w-full h-44 rounded-xl mt-2" />}
                    />
                )}
                {/* update Button */}
                <button type="submit" className='mt-5 rounded-full justify-end bg-emerald-400 hover:bg-emerald-600 py-3 px-8 font-bold shadow-lg hover:shadow-md'>Update</button>
            </div>
        </form>
    );
}