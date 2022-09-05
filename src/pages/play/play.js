import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

import useFetch from '../../hooks/useFetch';
import useTeam from '../../hooks/useTeam';
import Card from '../../components/Card/Card';

import styles from './play.module.css';

export default function Play() {
    const [challenges, setChallenges] = useState(null);

    const { apiPostGetJsonAsTeam } = useFetch();
    const { team, logoutTeam, fetchTeam } = useTeam();

    const fetchChallenges = async () => {
        const data = await apiPostGetJsonAsTeam('/rt22/challenges');
        setChallenges(data.challenges);
    };

    useEffect(() => {
        fetchChallenges();
    }, []);

    const qWasCorrect = () => {
        fetchChallenges();
        fetchTeam();
    };

    return (
        <>
            <section id='team'>
                {team ? (
                    <>
                        <h2>Team: {team.name}</h2>
                        <ul>
                            {team.members &&
                                team.members.map(
                                    m =>
                                        m.regNo && (
                                            <li key={m.regNo}>{m.regNo}</li>
                                        )
                                )}
                        </ul>
                        <div>{team.currentPoints || 0} points</div>
                    </>
                ) : (
                    <>loading team data...</>
                )}
                <button onClick={logoutTeam}>Logout</button>
                <button>
                    <NavLink to='/play/leaderboard'>Leaderboard</NavLink>
                </button>
            </section>

            <section id='challenges'>
                {challenges ? (
                    <>
                        <h2>Challenges</h2>
                        <div className={styles.challenges}>
                            {challenges.map(c => (
                                <Card
                                    key={c.id}
                                    challenge={c}
                                    isSolved={
                                        team
                                            ? c.solvedBy.includes(team.name)
                                            : false
                                    }
                                    qWasCorrect={qWasCorrect}
                                />
                            ))}
                        </div>
                    </>
                ) : (
                    <>loading challenges...</>
                )}
            </section>
        </>
    );
}
