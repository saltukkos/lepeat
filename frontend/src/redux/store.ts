import { configureStore } from '@reduxjs/toolkit'
import ProfileSliceReducer from '../slices/profileSlice'
import ThemeReducer from "../slices/themeSlice"
import SidebarReducer from "../slices/sidebarSlice"

export const store = configureStore({
    reducer: {
        profile: ProfileSliceReducer,
        theme: ThemeReducer,
        sidebar: SidebarReducer
    },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch