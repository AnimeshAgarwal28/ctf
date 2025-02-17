import { useState, useEffect } from 'react';
import styles from './challengeModal.module.css';
import useFetch from '../../hooks/useFetch';
import ReactMarkdown from 'react-markdown';
import PopAlert from '../popAlert/popAlert';

import LoadingAnimation from '../loadingAnimation/loadingAnimation';
const myStyle={
    textDecoration:"none",
    fontFamily:"monospace",
    color:"#ebcece",
    fontSize:"14px",
    marginBottom:"5px",
    paddingRight:"8px",
    backgroundColor:""
  }
function ChallengeModal({
    challenge,
    modalRef,
    questionModalOpen,
    setQuestionModalOpen,
    isSolved,
    qWasCorrect,
    ques_no
}) {

    const [showAlert, setShowAlert] = useState(false);

    const handleShowAlert = () => {
      setShowAlert(true);
    };
  
    const handleCloseAlert = () => {
      setShowAlert(false);
    };
    // const [timer, setTimer] = useState(false);


    const [inputValue, setInputValue] = useState('');
    const [hint_1, setHint1] = useState('');
    const [hint_2, setHint2] = useState('');
    const [hint_3, setHint3] = useState('');
    const [loading, setLoading] = useState(false);
    const [showHints, setShowHints] = useState({
        hint1: false,
        hint2: false,
        hint3: false
    });
    
    function inputChangeHandler(event) {
        setInputValue(event.target.value);
    }

    function closeQuestionModal() {
        if (modalRef.current) {
            setQuestionModalOpen(false);
            modalRef.current.close();
            setInputValue('');
        }
    }

    const { apiPostAsTeam, api } = useFetch();

    const submitFlag = async () => {
        const res = await apiPostAsTeam('/ctf/submit-flag', {
            flag: inputValue,
            challenge_id: challenge.id
        });
        try {
            setLoading(true);
            const data = await res.json();
            if (data.valid) {
                console.log('good!');
                setQuestionModalOpen(false);
                qWasCorrect();
            } else {
                // alert('invalid flag');
                handleShowAlert();
                setLoading(false);
            }
        } catch {
            alert('error');
            setLoading(false);
        }
    };

    useEffect(() => {
        const closeIfClickedOutside = e => {
            if (questionModalOpen && e.target === modalRef.current) {
                closeQuestionModal();
                setQuestionModalOpen(false);
            }
        };
        window.addEventListener('click', closeIfClickedOutside);
        return () => {
            window.removeEventListener('click', closeIfClickedOutside);
        };
    }, [modalRef, questionModalOpen, closeQuestionModal]);

    return (

        <>
        <dialog ref={modalRef} open={false} className={styles.modal}>
            <>
                {isSolved && 'done'}
                <div className={styles.close} onClick={closeQuestionModal}>
                    X
                </div>
                <div className={styles.header}>
                    <div className={styles.name}>
                        Challenge {challenge.name}
                    </div>
                    <div className={styles.points}>
                        {challenge.points} points
                    </div>
                </div>
                <div className={styles.grid}>
                    <div className={styles.description}>
                        <ReactMarkdown
                            components={{
                                a: props => (
                                    <a
                                        {...props}
                                        target='_blank'
                                        rel='noreferrer'
                                    />
                                )
                            }}
                        >
                            {challenge.description}
                            {/* links added */}
                            {/* dhananjay added above with meetesh */}
                        </ReactMarkdown>
                        <div className={styles.ctfLinks}>
                            {challenge.links.map((item)=>
                                <a href={item.link} style={myStyle} >{item.name}</a>
                            )}
                        </div>
                        Solved by {challenge.solvedBy.length} teams
                    </div>
                </div>
                {loading ? (
                    <LoadingAnimation />
                ) : (
                    <div className='form-end'>
                        <input
                            value={inputValue}
                            onChange={inputChangeHandler}
                            className={styles.valid}
                        />
                        <button
                            className='form-nav-button'
                            onClick={submitFlag}
                        >
                            Submit
                        </button>
                    </div>
                )}
        {showAlert && (
        <PopAlert
          message="Invalid flag"
          duration={3000}
          onClose={handleCloseAlert}
        />
      )}
                <div className={styles.hints}>
                    <button
                        className='form-nav-button'
                        onClick={() => {
                            console.log(ques_no);
                            apiPostAsTeam("/ctf/getHint", {
                                    hint: 0,
                                    challenge_id: ques_no
                            })
                                .then(res => res.json())
                                .then((data) => {
                                    let hint = data["hint"];
                                    setShowHints({ ...showHints, hint1: true });
                                    setHint1(hint);
                                });
                        }}
                    >
                        Hint 1
                    </button>
                    {showHints.hint1 && (
                        <div className={styles.hintText}>{hint_1}</div>
                    )}
                    <div className={styles.hintSpacing}></div> {/* Add spacing */}
                    <button
                        className='form-nav-button'
                        onClick={() => {
                            console.log(ques_no);
                            apiPostAsTeam("/ctf/getHint", {
                                    hint: 1,
                                    challenge_id: ques_no
                            })
                                .then(res => res.json())
                                .then((data) => {
                                    let hint = data["hint"];
                                    setShowHints({ ...showHints, hint2: true });
                                    setHint2(hint);
                                });
                        }}
                    >
                        Hint 2
                    </button>
                    {showHints.hint2 && (
                        <div className={styles.hintText}>{hint_2}</div>
                    )}
                    <div className={styles.hintSpacing}></div>
                    <button
                        className='form-nav-button'
                        onClick={() => {
                            console.log(ques_no);
                            apiPostAsTeam("/ctf/getHint", {
                                    hint: 2,
                                    challenge_id: ques_no
                            })
                                .then(res => res.json())
                                .then((data) => {
                                    let hint = data["hint"];
                                    setShowHints({ ...showHints, hint3: true });
                                    setHint3(hint);
                                });
                        }}
                    >
                        Hint 3
                    </button>
                    {showHints.hint3 && (
                        <div className={styles.hintText}>
                            {hint_3}
                        </div>
                    )}
                </div>
            </>
        </dialog>
        </>
    );
}

export default ChallengeModal;
