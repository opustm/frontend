import React, { useState, useEffect } from 'react';
import { Axios as api, API_ENDPOINTS as urls } from '../../services/api.service';
import { Link, Redirect, useParams } from 'react-router-dom';
import './teams.css';

const TeamView = (props) => {
    const [isLoading,setIsLoading] = useState(true);
    const [details,setDetails] = useState();
    const [members,setMembers] = useState();
    let teamUsername = useParams();

    useEffect(() => {
        async function fetchDetails() {
            const request = await api.get(
                urls.teams.fetchDetails(teamUsername)
                )
            setDetails(request.data);
            console.log(request.data);
            return request;
        }
        try {
            fetchDetails();
        }
        catch (err) {
            <Redirect to="/404"/>
        }
    }, [teamUsername]);
    
    return (
        <div className="page">
            <h1>Template</h1>
        </div>
    )
}

export default TeamView;