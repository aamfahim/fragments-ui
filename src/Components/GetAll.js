import { useEffect, useState } from 'react';
import { getUserFragments } from '../api';
import { getUser } from '../auth';

export default function GetAll() {
    const [fragmentsids, setFragmentsids] = useState([]);
    const [fragmentsobjs, setFragmentsobjs] = useState([]);
    // const [fragments, setFragments] = useState([]);
    const [expand, setExpand] = useState(false);


    const fetchData = async () => {
        console.log('useEffect is running with expand:', expand);
        try {
            console.log('Fetching data with expand:', expand);
            const user = await getUser();
            const data = await getUserFragments(user, expand);
            if (expand) {
                setFragmentsobjs(data.fragments)
            } else {
                setFragmentsids(data.fragments);
            }
            // console.log(`expand is ${expand}. and fragments are`,{fragments});
        } catch (error) {
            console.error('Error fetching data:', error);
            if (expand) {
                setFragmentsobjs([])
            } else {
                setFragmentsids([]);
            }
        }
    };

    function sortFragmentsByUpdated(a, b) {
        const dateA = new Date(a.updated);
        const dateB = new Date(b.updated);
        return dateB - dateA; // For descending order
    }
    
    useEffect(() => {
        fetchData();
    }, [expand]);

    return (
        <>
            <button
                onClick={() => setExpand(!expand)}
                className="mt-5 rounded-full justify-end bg-blue-600 hover:bg-blue-700 py-3 px-8 font-bold shadow-lg hover:shadow-md"
            >{expand ? "Collapse" : "Expand"}</button>
            {(fragmentsids.length === 0 && fragmentsobjs.length === 0) ? (
                <div><strong>Empty</strong></div>
            ) : (
                expand ?
                    fragmentsobjs.sort(sortFragmentsByUpdated).map((fragment, index) => (
                        <div key={index} className="p-4 m-2 border rounded-lg">
                            <p><strong>ID:</strong> {fragment.id}</p>
                            <p><strong>Owner ID:</strong> {fragment.ownerId}</p>
                            <p><strong>Created:</strong> {fragment.created}</p>
                            <p><strong>Updated:</strong> {fragment.updated}</p>
                            <p><strong>Type:</strong> {fragment.type}</p>
                            <p><strong>Size:</strong> {fragment.size}</p>
                            <button
                                className="bg-blue-600 hover:bg-blue-700 py-2 px-2 font-bold shadow-lg hover:shadow-md rounded"
                                onClick={() => navigator.clipboard.writeText(fragment.id)}>Copy ID</button>
                        </div>
                    ))
                    :
                    fragmentsids.map((fragment, index) => (
                        <div key={index} className="p-4 m-2 border rounded-lg">
                            <p><strong>ID:</strong> {fragment} <button
                                className="bg-blue-600 hover:bg-blue-700 py-2 px-2 font-bold shadow-lg hover:shadow-md rounded"
                                onClick={() => navigator.clipboard.writeText(fragment)}>Copy ID</button></p>

                        </div>

                    ))
            )}
        </>
    );
}

