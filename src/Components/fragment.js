import React, { useState } from 'react';
import GetAll from './GetAll';
import PostForm from './PostForm';
import GetById from './GetById';

export default function Fragment() {
    const [activeComponent, setActiveComponent] = useState('GetAll');

    return (
        <>
            <div className="mb-5 space-x-5">
                <button
                    onClick={() => setActiveComponent('GetAll')}
                    className="mt-5 rounded-full justify-end bg-blue-600 hover:bg-blue-700 py-3 px-8 font-bold shadow-lg hover:shadow-md"
                >
                    Get all
                </button>
                <button
                    onClick={() => setActiveComponent('GetById')}
                    className="mt-5 rounded-full justify-end bg-blue-600 hover:bg-blue-700 py-3 px-8 font-bold shadow-lg hover:shadow-md"
                >
                    Get By ID
                </button>
                <button
                    onClick={() => setActiveComponent('PostForm')}
                    className="mt-5 rounded-full justify-end bg-blue-600 hover:bg-blue-700 py-3 px-8 font-bold shadow-lg hover:shadow-md"
                >
                    Post
                </button>
            </div>
            {activeComponent === 'GetAll' && <GetAll />}
            {activeComponent === 'GetById' && <GetById />}
            {activeComponent === 'PostForm' && <PostForm />}
        </>
    );
}

