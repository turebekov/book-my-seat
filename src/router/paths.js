/**
 * Define all of your application routes here
 * for more information on routes, see the
 * official documentation https://router.vuejs.org/en/
 */
import store from '../store'

export default [
    {
        path: '*',
        meta: {
            name: '',
            requiresAuth: true
        },
        redirect: {
            path: '/dashboard'
        }
    },
    // This  allows you to have pages apart of the app but no rendered inside the dash
    {
        path: '/',
        meta: {
            name: '',
            requiresAuth: false
        },
        component: () =>
            import(/* webpackChunkName: "routes" */ `@/views/LoginHome.vue`),
        // redirect if already signed in
        beforeEnter: (to, from, next) => {
           /* const url = new URL(document.URL);
            const token = url.searchParams.get("token");*/
            if (store.getters['auth/authorized']) {
                next('/dashboard')
            } else {
                next()
            }
        },
        children: [
            {
                path: '',
                component: () => import(`@/components/auth/LoginForm.vue`)
            },
            {
                path: 'register',
                component: () => import(`@/components/auth/RegisterForm.vue`)
            },
            {
                path: 'activate',
                name: 'activate',
                component: () => import(`@/components/auth/UserActivate.vue`),
                props: true
            }
        ]
    },
    // add any extra routes that you want rendered in the dashboard as a child below. Change toolbar names here
    {
        path: '/dashboard',
        meta: {
            name: 'Dashboard View',
            requiresAuth: false
        },
        component: () => import(`@/views/DashboardView.vue`),
        children: [
            {
                path: '',
                name: 'Workplace',
                meta: {
                    name: 'Dashboard View',
                    requiresAuth: true
                },
                component: () => import(`@/components/WorkplaceViews/workplace/Workplace.vue`)
            },
            {
                path: 'add',
                name: 'WorkplaceForm',
                component: () => import(`@/components/WorkplaceViews/workplace/WorkplaceForm.vue`)
            },
            {
                path: 'form',
                name: 'Бронирование',
                component: () => import(`@/components/WorkplaceViews/workplace/WorkplaceForm.vue`)
            },
        ]
    }
]
