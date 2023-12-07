import React, { useState } from 'react';
import { postUserFragment } from '../api';
import { getUser } from '../auth';
import { useForm, Controller } from 'react-hook-form';

export default function PostForm() {
    const [fileMismatch, setfileMismatch] = useState("");
    const { control, handleSubmit, watch } = useForm();
    const selectedType = watch("type", "text/plain"); // Default to "text/plain"


    const onSubmit = async (data) => {
        const user = await getUser();
        let typeMatch = true;

        console.log(data);
        if (selectedType.startsWith('image/')) {
            const file = data.inputFile[0]; // The actual file object should be here now
            console.log("file is", file);

            if (file) {
                console.log("inside file");
                const fileExtension = file.name.split('.').pop().toLowerCase();
                let selectedTypeExtension = selectedType.split('/').pop().toLowerCase();
                console.log("fileExtension is", fileExtension);
                console.log("selectedTypeExtension is", selectedTypeExtension);
                if (selectedTypeExtension == "jpeg") {
                    selectedTypeExtension = "jpg";
                }

                if (!["png", "jpg", "gif", "webp"].includes(fileExtension) || selectedTypeExtension !== fileExtension) {
                    setfileMismatch("The file type and the selected type do not match.");
                    typeMatch = false;
                } else {
                    setfileMismatch("");
                    console.log("data is", data);

                    const res = await postUserFragment(user, data.type, file);
                    console.log(res);    
                }
            }
        } else {
            const res = await postUserFragment(user, data.type, data.input);
            console.log(res);
        }

    };


    return (
        <form onSubmit={handleSubmit(onSubmit)} >
            <div>
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
                        name="inputFile"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, name, ref } }) => (
                            <input
                                type="file"
                                name={name}
                                ref={ref}
                                onChange={(e) => {
                                    onChange(e.target.files); // Update the form state
                                }}
                                className="p-5 rounded-xl mt-2"
                            />
                        )}
                    />
                ) : (
                    <Controller
                        name="input"
                        control={control}
                        defaultValue=""
                        render={({ field }) => <textarea {...field} className="p-5 w-full h-44 rounded-xl mt-2" />}
                    />
                )}
                {fileMismatch && <p className="text-red-500">{fileMismatch}</p>}
                {/* Post Button */}
                <button type="submit" className='mt-5 rounded-full justify-end bg-emerald-400 hover:bg-emerald-600 py-3 px-8 font-bold shadow-lg hover:shadow-md'>Post</button>
            </div>
        </form>
    );
}
