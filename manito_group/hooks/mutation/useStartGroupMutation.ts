import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
    MANITO_GROUP_DETAIL,
    MANITO_GROUP_LIST_QUERY_KEY,
} from '@/manito_group/constant/query_key'
import { startGroup } from '@/manito_group/lib/fetch'

export const useStartGroupMutation = () => {
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: startGroup,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: [MANITO_GROUP_DETAIL, variables.groupId],
            })
            queryClient.invalidateQueries({
                queryKey: [MANITO_GROUP_LIST_QUERY_KEY],
            })
        },
    })

    return mutation
}
