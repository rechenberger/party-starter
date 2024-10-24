import { omit } from 'lodash-es'

export const createSuperState = <PublicState, SecretState>({
  publicState,
  secretState,
}: {
  publicState: PublicState
  secretState: SecretState
}) => {
  const editPublicState = async (
    state: PublicState,
  ): Promise<PublicSuperState<PublicState>> => {
    'use server'
    console.log('superState', {
      old: { publicState, secretState },
      newState: state,
    })
    const newSuperState = createSuperState({
      publicState: state,
      secretState: secretState,
    })
    return toPublicState(newSuperState)
  }

  return {
    publicState,
    secretState,
    editPublicState,
  }
}

export type SuperState<PublicState, SecretState> = {
  publicState: PublicState
  secretState: SecretState
  editPublicState: (
    state: PublicState,
  ) => Promise<PublicSuperState<PublicState>>
}

export const toPublicState = <PublicState, SecretState>(
  superState: SuperState<PublicState, SecretState>,
): PublicSuperState<PublicState> => {
  return omit(superState, 'secretState')
}

export type PublicSuperState<PublicState> = Omit<
  SuperState<PublicState, unknown>,
  'secretState'
>
