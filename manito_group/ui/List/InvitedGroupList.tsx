import { useInvitedManitoGroupListQuery } from '@/manito_group/hooks'

import InvitedGroupCard from '../Card/InvitedGroupCard'

const InvitedGroupList = ({ active }: { active: boolean }) => {
    const { data, isLoading, isFetching } = useInvitedManitoGroupListQuery()
    return (
        <section
            className="px-4"
            style={{ display: active ? 'block' : 'none' }}
        >
            <ul>
                {(isLoading || isFetching) && <li>loading...</li>}
                {data?.map((g) => <InvitedGroupCard key={g.id} group={g} />)}
            </ul>
        </section>
    )
}

export default InvitedGroupList
