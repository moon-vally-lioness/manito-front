import { FormEventHandler, useCallback, useEffect, useState } from 'react'
import ReactModal from 'react-modal'

import styles from '@/common/styles'
import { useGetChatOpponents } from '@/manito_group/hooks'
import { useEndResultQuery, usePredictMutation } from '@/manito_group/hooks'
import {
    DeserializedManitoGroup,
    GroupStatus,
    PredictStatus,
} from '@/manito_group/model'
import manitoGroupStyles from '@/manito_group/styles'

import ChatOpponent from './ChatOpponent'
import Chatting from './Chatting'

export default function EndedGroupDetail({
    groupData,
}: {
    groupData: DeserializedManitoGroup
}) {
    const chatOpponents = useGetChatOpponents(groupData.id)
    const { data: endResult } = useEndResultQuery(groupData.id)
    const [modalOpen, setModalOpen] = useState(false)
    const [maniteeName, setManiteeName] = useState('')
    const mutation = usePredictMutation()

    useEffect(() => {
        if (
            !modalOpen &&
            endResult?.manitoResultStatus === PredictStatus.NOTSUBMIT
        ) {
            setModalOpen(true)
        }
    }, [modalOpen, endResult])

    const handleModalClose = useCallback(() => {
        setManiteeName('')
        setModalOpen(false)
    }, [])

    const handlePredictSubmit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault()
        if (maniteeName.trim().length === 0) {
            alert('마니티 이름을 입력해주세요.')
            return
        }
        mutation.mutate(
            { groupId: groupData.id, maniteeName },
            {
                onSuccess(result) {
                    if (result.manitoResultStatus === PredictStatus.CORRECT) {
                        alert('정답입니다!')
                    } else if (
                        result.manitoResultStatus === PredictStatus.INCORRECT
                    ) {
                        alert(
                            `틀렸습니다. 나를 도와준 사람은 ${result.maniteeName} 이었습니다!`
                        )
                    }
                    setModalOpen(false)
                },
            }
        )
    }

    return (
        <div className={manitoGroupStyles.chatContentsWrapper}>
            <section className={manitoGroupStyles.chatOpponentSection}>
                {chatOpponents && (
                    <ul>
                        <ChatOpponent
                            chatId={chatOpponents.manitoChatId}
                            type="manito"
                            opponentName={chatOpponents.manitoName}
                        />
                        <ChatOpponent
                            chatId={chatOpponents.maniteeChatId}
                            type="manitee"
                            opponentName={endResult?.maniteeName}
                            predictResult={endResult?.manitoResultStatus}
                        />
                    </ul>
                )}
            </section>
            <section className={manitoGroupStyles.chattingSection}>
                <Chatting status={GroupStatus.ENDED} />
            </section>
            <ReactModal
                className="max-w-sm m-auto mt-20 bg-white"
                isOpen={modalOpen}
                onRequestClose={handleModalClose}
            >
                <form className={styles.form} onSubmit={handlePredictSubmit}>
                    <h3 className="font-bold">
                        모임이 종료되었습니다. 나를 도와준 사람 이름을
                        맞춰보세요.
                    </h3>

                    <input
                        className={styles.input}
                        type="text"
                        placeholder="나를 도와준 사람 이름"
                        value={maniteeName}
                        onChange={(e) => setManiteeName(e.target.value)}
                    />
                    <button className={styles.button.black}>제출</button>
                </form>
            </ReactModal>
        </div>
    )
}
