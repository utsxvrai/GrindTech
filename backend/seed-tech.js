const { TechRepository, TopicRepository, ResourceRepository, UserRepository, QuestionRepository } = require('./src/repositories');
const prisma = require('./src/config/db-config');



async function seedReact() {
    const techRepo = new TechRepository();
    const topicRepo = new TopicRepository();
    const resourceRepo = new ResourceRepository();
    const questionRepo = new QuestionRepository();
    const userRepo = new UserRepository();

    let react = await techRepo.findByName('React');
    if (!react) {
        react = await techRepo.create({ techName: 'React' });
    }

    const adminUser = await userRepo.model.findFirst();
    if (!adminUser) {
        console.error('No users found to assign topics to');
        return;
    }

    const topicsWithResources = [
        {
            name: 'React Basics 1',
            resources: [
                { name: 'React Official Documentation - Quick Start', resource: 'https://react.dev/learn' },
                { name: 'W3Schools React Tutorial', resource: 'https://www.w3schools.com/react/' },
                { name: 'React in 100 Seconds', resource: 'https://www.youtube.com/watch?v=Tn6-PIqc4UM' }
            ],
            questions: [
                'What is React and why is it used?',
                'How is React different from Angular or Vue?',
                'What is a React component?',
                'How do you create a component in React?',
                'What is JSX and why do we use it in React?'
            ]
        },
        {
            name: 'React Basics 2',
            resources: [
                { name: 'Getting Started with React (MDN)', resource: 'https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/React_getting_started' },
                { name: 'Writing Markup with JSX', resource: 'https://react.dev/learn/writing-markup-with-jsx' },
                { name: 'JSX Explained Simply', resource: 'https://www.youtube.com/watch?v=7fPXI_MnBOY' }
            ],
            questions: [
                'Can you explain the virtual DOM in React?',
                'What are the differences between a class component and a functional component?',
                'How do you handle events in React?',
                'What are state and props in React?',
                'How do you pass data between components in React?'
            ]
        },
        {
            name: 'React State Management 3',
            resources: [
                { name: 'State: A Component\'s Memory', resource: 'https://react.dev/learn/state-a-components-memory' },
                { name: 'Sharing State Between Components', resource: 'https://react.dev/learn/sharing-state-between-components' },
                { name: 'useState Hook Deep Dive', resource: 'https://www.youtube.com/watch?v=4pO-HcG2igk' }
            ],
            questions: [
                'What is a stateful component?',
                'Can you explain how useState works?',
                'How do you update the state of a parent component from a child component?',
                'What is lifting state up in React?',
                'When do you use Redux or Context API for state management?'
            ]
        },
        {
            name: 'React Lifecycle & Hooks 4',
            resources: [
                { name: 'Synchronizing with Effects', resource: 'https://react.dev/learn/synchronizing-with-effects' },
                { name: 'Built-in React Hooks Reference', resource: 'https://react.dev/reference/react' },
                { name: 'useEffect Hook Tutorial', resource: 'https://www.youtube.com/watch?v=gv9ugDJ1ynU' }
            ],
            questions: [
                'Explain the lifecycle methods of a React class component.',
                'What are React Hooks and why were they introduced?',
                'Can you explain the useEffect hook and its dependencies?',
                'How do you perform cleanup in useEffect?',
                'What is the useMemo hook and when should it be used?'
            ]
        },
        {
            name: 'Component Communication 5',
            resources: [
                { name: 'Passing Props to a Component', resource: 'https://react.dev/learn/passing-props-to-a-component' },
                { name: 'Passing Data Deeply with Context', resource: 'https://react.dev/learn/passing-data-deeply-with-context' },
                { name: 'Props vs State in React', resource: 'https://www.youtube.com/watch?v=m7OWCtHI6p4' }
            ],
            questions: [
                'What is the useCallback hook?',
                'How can you create custom hooks in React?',
                'What are the rules of hooks?',
                'What is React Context and how does it work?',
                'How do you use the useContext hook?'
            ]
        },
        {
            name: 'React Routing 6',
            resources: [
                { name: 'React Router Official Tutorial', resource: 'https://reactrouter.com/en/main/start/tutorial' },
                { name: 'React Router v6 Complete Guide', resource: 'https://www.freecodecamp.org/news/react-router-v6-tutorial/' },
                { name: 'React Router v6 in 10 Minutes', resource: 'https://www.youtube.com/watch?v=Ul3y1LXxzdU' }
            ],
            questions: [
                'What is React Router and why is it used?',
                'How do you define routes in a React application?',
                'Explain the difference between BrowserRouter and HashRouter.',
                'How do you handle navigation programmatically in React Router?',
                'What are route parameters and how do you access them?'
            ]
        },
        {
            name: 'Styling in React 7',
            resources: [
                { name: 'Different Ways to Style React Components', resource: 'https://www.digitalocean.com/community/tutorials/react-styling-react-components' },
                { name: 'CSS Modules vs CSS-in-JS', resource: 'https://blog.logrocket.com/css-modules-vs-css-in-js-which-one-to-choose/' },
                { name: 'Styling Options in React Explained', resource: 'https://www.youtube.com/watch?v=j5P9F1Vum9o' }
            ],
            questions: [
                'How do you style components in React?',
                'What are CSS Modules and how do they help in React?',
                'Explain CSS-in-JS and name some popular libraries.',
                'How do you use inline styles in React?',
                'What is Tailwind CSS and how can it be used with React?'
            ]
        },
        {
            name: 'Performance Optimization 8',
            resources: [
                { name: 'React Performance Optimization Guide', resource: 'https://legacy.reactjs.org/docs/optimizing-performance.html' },
                { name: 'How to use React.memo effectively', resource: 'https://dmitripavlutin.com/use-react-memo-wisely/' },
                { name: 'React Performance Tips for Developers', resource: 'https://www.youtube.com/watch?v=Qp2e0vX5r2Y' }
            ],
            questions: [
                'How can you optimize the performance of a React application?',
                'What is React.memo and when should it be used?',
                'Explain code splitting in React and how to achieve it.',
                'What is lazy loading and how do you implement it for components?',
                'How do you identify performance bottlenecks in a React app?'
            ]
        },
        {
            name: 'Form Handling 9',
            resources: [
                { name: 'React Forms and Controlled Components', resource: 'https://react.dev/reference/react-dom/components/input' },
                { name: 'React Hook Form: The Complete Guide', resource: 'https://blog.logrocket.com/react-hook-form-complete-guide/' },
                { name: 'React Hook Form vs Formik', resource: 'https://www.youtube.com/watch?v=PnrJDPhR5fU' }
            ],
            questions: [
                'How do you handle forms in React?',
                'What is the difference between controlled and uncontrolled components?',
                'How do you handle form validation in React?',
                'What are some popular libraries for form management in React?',
                'How do you handle multiple input fields in a single state object?'
            ]
        },
        {
            name: 'Advanced React Topics 10',
            resources: [
                { name: 'Higher-Order Components (HOCs) Guide', resource: 'https://legacy.reactjs.org/docs/higher-order-components.html' },
                { name: 'Render Props Pattern in React', resource: 'https://legacy.reactjs.org/docs/render-props.html' },
                { name: 'Advanced React Patterns & Concepts', resource: 'https://www.youtube.com/watch?v=YpD-Y8YwLpY' }
            ],
            questions: [
                'What is a Higher-Order Component (HOC)?',
                'Explain the concept of render props.',
                'What are React Fragments and why are they used?',
                'What is the purpose of the key prop in React lists?',
                'How do you handle errors in React components using Error Boundaries?'
            ]
        },
        {
            name: 'React Patterns 11',
            resources: [
                { name: 'React Design Patterns - Patterns.dev', resource: 'https://www.patterns.dev/posts/react-patterns' },
                { name: 'Guide to React Compound Components', resource: 'https://blog.logrocket.com/guide-to-react-compound-components-with-hooks/' },
                { name: '5 React Design Patterns You Should Know', resource: 'https://www.youtube.com/watch?v=4FhJit4_A2I' }
            ],
            questions: [
                'What is the difference between useMemo and useCallback?',
                'How do you use the useReducer hook?',
                'What is the purpose of the useRef hook?',
                'Explain the concept of portal in React.',
                'What are React concurrent mode and transitions?'
            ]
        },
        {
            name: 'React Development Environment & Tooling 12',
            resources: [
                { name: 'Vite vs Create React App in 2024', resource: 'https://blog.logrocket.com/vite-vs-create-react-app/' },
                { name: 'Setting up ESLint & Prettier for React', resource: 'https://javascript.plainenglish.io/setup-eslint-and-prettier-for-react-in-2024-f7b24345229d' },
                { name: 'Getting Started with Vite and React', resource: 'https://www.youtube.com/watch?v=KzYsh3WvA4s' }
            ],
            questions: [
                'What is Create React App (CRA)?',
                'What are the alternatives to Create React App?',
                'Explain the role of Webpack and Babel in a React project.',
                'What is Vite and why is it gaining popularity?',
                'How do you set up a React project from scratch?'
            ]
        },
        {
            name: 'Testing in React 13',
            resources: [
                { name: 'Testing React Overview (Official)', resource: 'https://legacy.reactjs.org/docs/testing.html' },
                { name: 'React Testing Library Tutorial for Beginners', resource: 'https://www.freecodecamp.org/news/react-testing-library-tutorial-javascript-unit-testing-basics/' },
                { name: 'RTL & Jest Crash Course', resource: 'https://www.youtube.com/watch?v=ML5egqL3YFE' }
            ],
            questions: [
                'Why is testing important in React development?',
                'What is Jest and how is it used with React?',
                'Explain React Testing Library and its benefits.',
                'What is snapshot testing?',
                'How do you mock API calls in tests?'
            ]
        },
        {
            name: 'State Management Libraries & GraphQL 14',
            resources: [
                { name: 'Redux Toolkit Quick Start', resource: 'https://redux-toolkit.js.org/tutorials/quick-start' },
                { name: 'Zustand: A Simple State Manager', resource: 'https://blog.logrocket.com/guide-to-zustand-state-management/' },
                { name: 'Zustand vs Redux Explained', resource: 'https://www.youtube.com/watch?v=O_O_nS7Sj-w' }
            ],
            questions: [
                'What is Redux and what are its core principles?',
                'Explain the role of actions, reducers, and store in Redux.',
                'What is Redux Toolkit?',
                'What is GraphQL and how can it be used with React?',
                'How do you use Apollo Client to fetch data in React?'
            ]
        },
        {
            name: 'React with TypeScript 15',
            resources: [
                { name: 'TypeScript Cheat Sheet for React', resource: 'https://react-typescript-cheatsheet.netlify.app/' },
                { name: 'How to use TypeScript in React Apps', resource: 'https://www.freecodecamp.org/news/how-to-use-typescript-in-react-apps/' },
                { name: 'React with TypeScript Tutorial', resource: 'https://www.youtube.com/watch?v=ydkQlJhodio' }
            ],
            questions: [
                'Why use TypeScript with React?',
                'How do you define props using TypeScript?',
                'How do you use TypeScript with React Hooks?',
                'What are the benefits of using TypeScript in a React project?',
                'How do you handle events with TypeScript in React?'
            ]
        },
        {
            name: 'Integrations and API Handling 16',
            resources: [
                { name: 'Fetching Data in React (Docs)', resource: 'https://react.dev/learn/synchronizing-with-effects#fetching-data' },
                { name: 'Using Axios with React', resource: 'https://www.digitalocean.com/community/tutorials/react-axios-react' },
                { name: 'Modern API Handling in React', resource: 'https://www.youtube.com/watch?v=vVWA8W2vN3c' }
            ],
            questions: [
                'How do you integrate a third-party library in React?',
                'How do you handle API calls in a React application?',
                'What is Axios and why is it often used with React?',
                'Explain the concept of interceptors in Axios.',
                'How do you handle authentication in a React app?'
            ]
        },
        {
            name: 'Deployment and Optimization 17',
            resources: [
                { name: 'Deploying React Apps (CRA Guide)', resource: 'https://create-react-app.dev/docs/deployment/' },
                { name: 'Vercel vs Netlify for React Apps', resource: 'https://www.hostinger.com/tutorials/vercel-vs-netlify' },
                { name: 'Deploying React with Best Practices', resource: 'https://www.youtube.com/watch?v=2hR-uWjBAgw' }
            ],
            questions: [
                'What are some common deployment strategies for React applications?',
                'How do you optimize a React app for production?',
                'What are service workers and how can they benefit a React application?',
                'How do you configure HTTPS in a React app?',
                'Why is accessibility important in web development?'
            ]
        },
        {
            name: 'SEO & React Native 18',
            resources: [
                { name: 'SEO for Developers - Fireship', resource: 'https://www.youtube.com/watch?v=-B58GgsehKQ' },
                { name: 'Next.js Metadata and SEO', resource: 'https://nextjs.org/docs/app/building-your-application/optimizing/metadata' },
                { name: 'React SEO with Next.js Tutorial', resource: 'https://www.youtube.com/watch?v=8BrZeaw3sLQ' }
            ],
            questions: [
                'How can you make a React application accessible?',
                'What is ARIA and how it is used in React?',
                'What is internationalization (i18n) in React?',
                'How do you implement localization (l10n) in a React app?',
                'How do you structure large React applications?'
            ]
        },
        {
            name: 'Accessibility & Internationalization 19',
            resources: [
                { name: 'Accessibility in React (Legacy Docs)', resource: 'https://legacy.reactjs.org/docs/accessibility.html' },
                { name: 'Introduction to React-i18next', resource: 'https://react.i18next.com/' },
                { name: 'Web Accessibility in React Guide', resource: 'https://www.youtube.com/watch?v=9S62m9y9ZpQ' }
            ],
            questions: [
                'What are some best practices when writing React code?',
                'How do you ensure code quality and maintainability in a React project?',
                'How do you manage feature branches in React development with Git?',
                'What are your strategies for resolving merge conflicts in React projects?',
                'How would you handle a feature request or bug report in an ongoing React project?'
            ]
        },
        {
            name: 'Best Practices & Career 20',
            resources: [
                { name: 'React Best Practices Guide (freeCodeCamp)', resource: 'https://www.freecodecamp.org/news/react-best-practices-ever-developer-should-know/' },
                { name: 'Bulletproof React Architecture', resource: 'https://github.com/alan2207/bulletproof-react' },
                { name: '10 React Antipatterns to Avoid', resource: 'https://www.youtube.com/watch?v=b0IZo2Aho9Y' }
            ],
            questions: [
                'Describe your process for optimizing a component that has complex state.',
                'How do you keep up with the latest trends and updates in React?',
                'What are some useful resources for learning React?',
                'How do you contribute to the React community?',
                'What are your career goals as a React developer?'
            ]
        }
    ];

    for (const topicData of topicsWithResources) {
        const existingTopic = await topicRepo.model.findFirst({
            where: { name: topicData.name, techId: react.techId }
        });

        let topic = existingTopic || await topicRepo.create({
            name: topicData.name,
            techId: react.techId,
            userId: adminUser.uuid
        });

        console.log(`${existingTopic ? '📝 Topic exists:' : '✅ Created topic:'} ${topicData.name}`);

        for (const resourceData of topicData.resources) {
            const existingResource = await resourceRepo.model.findFirst({
                where: { name: resourceData.name, topicId: topic.topicId }
            });
            if (!existingResource) {
                await resourceRepo.create({ ...resourceData, topicId: topic.topicId });
            }
        }

        for (const questionText of topicData.questions) {
            const existingQuestion = await questionRepo.model.findFirst({
                where: { question: questionText, topicId: topic.topicId }
            });
            if (!existingQuestion) {
                await questionRepo.create({
                    question: questionText,
                    topicId: topic.topicId,
                    userId: adminUser.uuid
                });
            }
        }
    }

    console.log('🎉 React topics, resources, and questions seeded successfully!');
}

async function main() {
    try {
        
        await seedReact();
    } catch (error) {
        console.error('Seeding failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();