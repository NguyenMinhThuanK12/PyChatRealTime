import { lazy, Suspense } from 'react';
import { RouterProvider, createBrowserRouter, json } from 'react-router-dom';
import * as ROUTE from './constants/routes';

import { tokenLoader, authChecker } from "./utils/auth";
import { action as authAction } from "./layouts/AuthLayout";
import { action as getMessages } from './components/message/MessageContainer';
import Spinner from './components/spinner/Spinner.jsx'
import Axios from './api/index';
// Layout
import AuthLayout from './layouts/AuthLayout';
import DefaultLayout from './layouts/DefaultLayout';

// Auth Page
const Login = lazy(() => import('./auth/login'));
const Signup = lazy(() => import('./auth/signup'));

// Detail Page
const Search = lazy(() => import('./pages/Search'));
const FriendList = lazy(() => import('./pages/FriendList'));
const Profile = lazy(() => import('./pages/Profile'));
const ChatConversation = lazy(() => import('./pages/ChatConversation'));
const NewConversation = lazy(() => import('./pages/NewConversation'));

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MessageContainer from './components/message/MessageContainer';
import { getChatBriefs } from './pages/ChatConversation';
import { useAuthContext } from './hooks/useAuthContext.jsx';


function App() {
	const [state, dispatch] = useAuthContext()
	const setLoggedInUser = (res) => {
		dispatch({ type: "LOGIN", value: res.data.data })
	}
	const router = createBrowserRouter([
		{
			path: ROUTE.HOME,
			element: <DefaultLayout />,
			id: "root",
			loader: authChecker,
			children: [
				{
					path: "conversation",
					element: (
						<Suspense fallback={<Spinner />}>
							<ChatConversation />
						</Suspense>
					),
					loader: getChatBriefs,
					children: [
						{
							path: "to",
							element: (
								<Suspense fallback={<Spinner />}>
									<NewConversation />
								</Suspense>
							),
							loader: async () => {
								return (await Axios.get('/api/v1/users')).data.data;
							}
						},
						{
							path: ":conversationID",
							element: (
								<Suspense fallback={<Spinner />}>
									<MessageContainer />
								</Suspense>
							),
							loader: getMessages
						}
					]
				},
				{
					path: ROUTE.SEARCH,
					element: (
						<Suspense fallback={<Spinner />}>
							<Search />
						</Suspense>
					)
				},
				{
					path: ROUTE.FRIEND_LIST,
					element: (
						<Suspense fallback={<Spinner />}>
							<FriendList />
						</Suspense>
					),
					loader: async () => {
						return (await Axios.get(`/api/v1/friendships?user_id=${JSON.parse(localStorage.getItem('user')).id}`)).data.data;
					}
				},
				{
					path: ROUTE.PROFILE,
					element: (
						<Suspense fallback={<Spinner />}>
							<Profile />
						</Suspense>
					),
					loader: async ({ params }) => {
						return (await Axios.get(`/api/v1/users?id=${params.id}`)).data.data;
					}
				}
			]
		},
		{
			path: "/",
			element: <AuthLayout />,
			children: [
				{
					path: ROUTE.LOGIN,
					element: (
						<Suspense fallback={<Spinner />}>
							<Login />
						</Suspense>
					),
					action: authAction(setLoggedInUser),

				},
				{
					path: ROUTE.SIGNUP,
					element: (
						<Suspense fallback={<Spinner />}>
							<Signup />
						</Suspense>
					),
					action: authAction(setLoggedInUser),
				}
			]
		}
	]);
	return (
		<div className='flex h-screen'>
			<RouterProvider router={router} />
			<ToastContainer
				autoClose={2500}
				pauseOnFocusLoss={false}
				position="top-right"
			/>
		</div>
	);
}

export default App;
