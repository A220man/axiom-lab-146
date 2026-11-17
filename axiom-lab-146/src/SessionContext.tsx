import { createContext, useContext, useState, ReactNode } from 'react'

// Session state types
type DeliveryMode = 'manual' | 'automatic'

type Comment = {
  id: string
  revision: string
  text: string
  status: 'queued' | 'delivered' | 'delivered-stale' | 'held-stale'
}

type SessionState = {
  // Whether session is live (not yet accepted/ended)
  isLive: boolean
  // Delivery mode: manual (explicit Send) or automatic
  deliveryMode: DeliveryMode
  // Pending comments not yet delivered
  pendingComments: Comment[]
  // All comments including delivered ones
  allComments: Comment[]
  // Revision this session was authored against
  authoredAgainstRevision: string
  // Whether Accept carried pending comments
  acceptCarriedPending: boolean
}

// Context default values
const SessionContextDefault: SessionState = {
  isLive: true,
  deliveryMode: 'manual',
  pendingComments: [],
  allComments: [],
  authoredAgainstRevision: 'initial',
  acceptCarriedPending: false
}

const SessionContext = createContext<SessionState>(SessionContextDefault)

// Context provider
export const SessionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<SessionState>(SessionContextDefault)

  return <SessionContext.Provider value={state}>{children}</SessionContext.Provider>
}

// Hook to access session state
export const useSession = (): SessionState => useContext(SessionContext)

// Action creators
export const setDeliveryMode = (mode: DeliveryMode) => ({
  type: 'setDeliveryMode' as const,
  payload: mode,
})

export const addComment = (comment: Omit<Comment, 'id' | 'status'>) => ({
  type: 'addComment' as const,
  payload: {
    ...comment,
    id: crypto.randomUUID(),
    status: 'queued',
  },
})

export const setCommentStatus = (commentId: string, status: Comment['status']) => ({
  type: 'setCommentStatus' as const,
  payload: { commentId, status },
})

export const clearPending = () => ({
  type: 'clearPending' as const,
})

export const setAcceptCarriedPending = (carried: boolean) => ({
  type: 'setAcceptCarriedPending' as const,
  payload: carried,
})

// Reducer type
type SessionAction =
  | { type: 'setDeliveryMode'; payload: DeliveryMode }
  | { type: 'addComment'; payload: Omit<Comment, 'id' | 'status'> }
  | { type: 'setCommentStatus'; payload: { commentId: string; status: Comment['status'] } }
  | { type: 'clearPending' }
  | { type: 'setAcceptCarriedPending'; payload: boolean }
  | { type: '_initialize'; payload: SessionState }

const sessionReducer = (state: SessionState, action: SessionAction): SessionState => {
  switch (action.type) {
    case 'setDeliveryMode':
      return { ...state, deliveryMode: action.payload }
    case 'addComment':
      return {
        ...state,
        pendingComments: [...state.pendingComments, action.payload],
        allComments: [...state.allComments, { ...action.payload, id: crypto.randomUUID(), status: 'queued' }],
      }
    case 'setCommentStatus':
      return {
        ...state,
        pendingComments: state.pendingComments.map(c =>
          c.id === action.payload.commentId ? { ...c, status: action.payload.status } : c
        ),
        allComments: state.allComments.map(c =>
          c.id === action.payload.commentId ? { ...c, status: action.payload.status } : c
        ),
      }
    case 'clearPending':
      return {
        ...state,
        pendingComments: [],
      }
    case 'setAcceptCarriedPending':
      return { ...state, acceptCarriedPending: action.payload }
    case '_initialize':
      return action.payload
    default:
      return state
  }
}

// Provider with reducer
export const SessionProviderWithReducer: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(sessionReducer, SessionContextDefault, () => SessionContextDefault)

  return <SessionContext.Provider value={state}>{children}</SessionContext.Provider>
}

export default SessionProvider
