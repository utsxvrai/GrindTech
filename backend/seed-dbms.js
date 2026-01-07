const { TechRepository, TopicRepository, ResourceRepository, UserRepository, QuestionRepository } = require('./src/repositories');
const prisma = require('./src/config/db-config');

async function seedDbms() {
    const techRepo = new TechRepository();
    const topicRepo = new TopicRepository();
    const resourceRepo = new ResourceRepository();
    const questionRepo = new QuestionRepository();
    const userRepo = new UserRepository();

    let dbms = await techRepo.findByName('DBMS');
    if (!dbms) {
        dbms = await techRepo.create({ techName: 'DBMS' });
    }

    const adminUser = await userRepo.model.findFirst();
    if (!adminUser) {
        console.error('No users found to assign topics to');
        return;
    }

    const topicsWithResources = [
        {
            name: 'DBMS Architecture & Abstraction 2',
            resources: [
                { name: 'DBMS Architecture – Tutorialspoint', resource: 'https://www.tutorialspoint.com/dbms/dbms_architecture.htm' },
                { name: 'Data Independence – GeeksforGeeks', resource: 'https://www.geeksforgeeks.org/dbms/what-is-data-independence-in-dbms/' },
                { name: 'Video: Data Independence & 3-Level', resource: 'https://www.youtube.com/watch?v=QK1l_wtBRIw' }
            ],
            questions: [
                'What are the main components of a DBMS architecture?',
                'Explain the three levels of data abstraction in DBMS.',
                'What is data independence? Differentiate between logical and physical data independence?',
                'What is a database schema? How is it different from a database instance (state)?',
                'What is a data dictionary (system catalog) and what is it used for?'
            ]
        },
        {
            name: 'Data Models 3',
            resources: [
                { name: 'Data Models in DBMS – GfG', resource: 'https://www.geeksforgeeks.org/dbms-data-model/' },
                { name: 'DBMS Data Models – Tutorialspoint', resource: 'https://www.tutorialspoint.com/dbms/dbms_data_models.htm' },
                { name: 'Video: Types of Data Models', resource: 'https://www.youtube.com/watch?v=Le8efR0xTdg' }
            ],
            questions: [
                'What are data models?',
                'Name and briefly describe different types of data models.'
            ]
        },
        {
            name: 'ER Model Basics 4',
            resources: [
                { name: 'ER Model – GeeksforGeeks', resource: 'https://www.geeksforgeeks.org/dbms-entity-relationship-model/' },
                { name: 'ERD in DBMS – Simplilearn', resource: 'https://www.simplilearn.com/tutorials/sql-tutorial/er-diagram-in-dbms' },
                { name: 'Video: ER Model Basics', resource: 'https://www.youtube.com/watch?v=5OviOmzEvCs' }
            ],
            questions: [
                'What is an Entity-Relationship (ER) model? Why is it used?',
                'Define entity, entity set, and entity type with examples.',
                'What is an attribute? Explain different types of attributes (simple, composite, multivalued, derived).',
                'What is a key attribute in an ER model?'
            ]
        },
        {
            name: 'ER Model Advanced Concepts 5',
            resources: [
                { name: 'Generalization & Aggregation – GfG', resource: 'https://www.geeksforgeeks.org/generalization-specialization-and-aggregation-in-er-model/' },
                { name: 'ER Model Notes – Waterloo', resource: 'https://cs.uwaterloo.ca/~tozsu/courses/CS338/lectures/10%20ER%20Model.pdf' },
                { name: 'Video: Advanced ER Modeling', resource: 'https://www.youtube.com/watch?v=W3lrOpODfjQ' }
            ],
            questions: [
                'What is the difference between strong entity set and weak entity set?',
                'What is cardinality in ER modeling (1:1, 1:N, M:N)? Give examples.',
                'What is participation constraint (total vs partial participation)?',
                'What is aggregation in ER modeling?',
                'What is generalization and specialization in DBMS?',
                'Draw and explain an ER diagram for a simple student–course–enrollment system.'
            ]
        },
        {
            name: 'Relational Model Basics 6',
            resources: [
                { name: 'Relational Model Intro – GfG', resource: 'https://www.geeksforgeeks.org/introduction-of-relational-model-and-codd-rules-in-dbms/' },
                { name: 'Relational Data Model – Tutorialspoint', resource: 'https://www.tutorialspoint.com/dbms/relational_data_model.htm' },
                { name: 'Video: Relational Model', resource: 'https://www.youtube.com/watch?v=3EJlovevfcA&t=600s' }
            ],
            questions: [
                'What is a relation in the relational model? What properties must a relation satisfy?',
                'What is a relation schema? Provide an example.',
                'Define degree and cardinality of a relation.'
            ]
        },
        {
            name: 'Relational Algebra 7',
            resources: [
                { name: 'Relational Algebra – GeeksforGeeks', resource: 'https://www.geeksforgeeks.org/introduction-of-relational-algebra-in-dbms/' },
                { name: 'Relational Algebra – Tutorialspoint', resource: 'https://www.tutorialspoint.com/dbms/relational_algebra.htm' },
                { name: 'Video: Relational Algebra Playlist', resource: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiFAN6I8CuViBuCdJgiOkT2Y' }
            ],
            questions: [
                'What is relational algebra? Why is it called a procedural query language?',
                'Explain the SELECT (σ), PROJECT (π), and RENAME (ρ) operations in relational algebra.',
                'Explain UNION, INTERSECTION, and SET DIFFERENCE operations in relational algebra.',
                'What is a JOIN operation? Explain natural join, theta join, and equi-join.',
                'What is division operation in relational algebra and when is it useful?'
            ]
        },
        {
            name: 'Keys and Constraints 8',
            resources: [
                { name: 'Keys in Relational Model – GfG', resource: 'https://www.geeksforgeeks.org/keys-in-relational-model-candidate-super-primary-alternate-and-foreign/' },
                { name: 'Integrity Constraints – GfG', resource: 'https://www.geeksforgeeks.org/integrity-constraints-in-dbms/' },
                { name: 'Video: Database Keys', resource: 'https://www.youtube.com/watch?v=3nTmjeqUbLg' }
            ],
            questions: [
                'Define super key, candidate key, primary key, and alternate key with examples.',
                'What is a composite key? When would you use one?',
                'What is a unique key? How is it different from a primary key?',
                'What is a foreign key? How does it enforce referential integrity?',
                'Explain entity integrity and referential integrity constraints.'
            ]
        },
        {
            name: 'Keys and Constraints (cont.) 9',
            resources: [
                { name: 'Keys in Relational Model – GfG', resource: 'https://www.geeksforgeeks.org/keys-in-relational-model-candidate-super-primary-alternate-and-foreign/' },
                { name: 'Integrity Constraints – GfG', resource: 'https://www.geeksforgeeks.org/integrity-constraints-in-dbms/' },
                { name: 'Video: Database Keys', resource: 'https://www.youtube.com/watch?v=3nTmjeqUbLg' }
            ],
            questions: [
                'What are check constraints? Give a practical example.',
                'What is the difference between NOT NULL, UNIQUE, and PRIMARY KEY constraints?',
                'What is a surrogate key? What are its pros and cons?',
                'What is a domain constraint in DBMS?',
                'What happens if you try to delete a referenced row in a parent table that has foreign-key references in a child table? Explain ON DELETE options (CASCADE, SET NULL, RESTRICT).'
            ]
        },
        {
            name: 'Functional Dependencies 10',
            resources: [
                { name: 'Functional Dependency – GfG', resource: 'https://www.geeksforgeeks.org/functional-dependency-and-attribute-closure/' },
                { name: 'FD & Attribute Closure Notes', resource: 'https://mrcet.com/downloads/digital_notes/CSE/II%20Year/DBMS.pdf' },
                { name: 'Video: Functional Dependencies', resource: 'https://www.youtube.com/watch?v=Wa1_ZCv_lKE' }
            ],
            questions: [
                'Define functional dependency and give formal notation and example.'
            ]
        },
        {
            name: 'Normalization (1NF–3NF) 11',
            resources: [
                { name: 'Normal Forms in DBMS – GfG', resource: 'https://www.geeksforgeeks.org/normal-forms-in-dbms/' },
                { name: 'Normalization 1NF–BCNF – DigitalOcean', resource: 'https://www.digitalocean.com/community/tutorials/database-normalization' },
                { name: 'Video: Normalization 1NF–5NF', resource: 'https://www.youtube.com/watch?v=GFQaEYEc8_8' }
            ],
            questions: [
                'What is normalization? Why is it important?',
                'Explain First Normal Form (1NF) with an example.',
                'Explain Second Normal Form (2NF) and partial dependency.',
                'Explain Third Normal Form (3NF) and transitive dependency.',
                'What is Boyce–Codd Normal Form (BCNF)? How is it stricter than 3NF?',
                'What are multivalued dependencies? What is 4NF?',
                'What is 5NF (Project-Join Normal Form)? In what kind of scenarios is it needed?',
                'What is denormalization? When is it acceptable to denormalize a schema?',
                'How would you normalize a table that stores customer and order details together into a good relational design?'
            ]
        },
        {
            name: 'SQL Fundamentals 13',
            resources: [
                { name: 'SQL Tutorial – W3Schools', resource: 'https://www.w3schools.com/sql/sql_intro.asp' },
                { name: 'SQL Basics – GeeksforGeeks', resource: 'https://www.geeksforgeeks.org/sql-tutorial/' },
                { name: 'Video: SQL Full Course', resource: 'https://www.youtube.com/watch?v=HXV3zeQKqGY' }
            ],
            questions: [
                'What are the different types of database languages (DDL, DML, DCL, TCL, DQL)? Give examples.',
                'Write SQL to create a simple EMPLOYEE table with appropriate constraints.',
                'Write SQL to insert, update, and delete rows in a table.',
                'Explain the difference between WHERE and HAVING clauses with example queries.'
            ]
        },
        {
            name: 'SQL Joins & Views 14',
            resources: [
                { name: 'SQL Joins – GeeksforGeeks', resource: 'https://www.geeksforgeeks.org/sql-join-set-1-inner-left-right-and-full-joins/' },
                { name: 'SQL Views – GeeksforGeeks', resource: 'https://www.geeksforgeeks.org/sql-views/' },
                { name: 'Video: SQL Joins Explained', resource: 'https://www.youtube.com/watch?v=9yeOJ0ZMUYw' }
            ],
            questions: [
                'What are INNER JOIN, LEFT JOIN, RIGHT JOIN, and FULL OUTER JOIN?',
                'What is a self-join? Give a use case.',
                'What is a view in SQL? What are its advantages and limitations?',
                'What is the difference between a view and a materialized view?'
            ]
        },
        {
            name: 'SQL Advanced Operations 15',
            resources: [
                { name: 'DELETE vs TRUNCATE vs DROP – GfG', resource: 'https://www.geeksforgeeks.org/difference-between-delete-truncate-and-drop-commands-in-sql/' },
                { name: 'Subqueries in SQL – GfG', resource: 'https://www.geeksforgeeks.org/sql-subquery/' },
                { name: 'Video: SQL Subqueries', resource: 'https://www.youtube.com/watch?v=HXV3zeQKqGY&t=7200s' }
            ],
            questions: [
                'Differentiate between DELETE, TRUNCATE, and DROP with respect to rollback and logging.',
                'What is a subquery? Differentiate between correlated and non-correlated subqueries.'
            ]
        },
        {
            name: 'Indexing & Files 16',
            resources: [
                { name: 'Indexing in Databases – GfG', resource: 'https://www.geeksforgeeks.org/dbms-indexing-in-databases/' },
                { name: 'B+ Tree in DBMS – GfG', resource: 'https://www.geeksforgeeks.org/introduction-of-b-plus-tree/' },
                { name: 'Video: Indexing & B+ Trees', resource: 'https://www.youtube.com/watch?v=Le8efR0xTdg&t=2400s' }
            ],
            questions: [
                'What is an index in DBMS? Why is it used?',
                'Differentiate between clustered and non-clustered indexes.',
                'What is a B-tree/B+ tree index? Why are B+ trees commonly used in databases?',
                'What is a covering index?',
                'What is a composite (multi-column) index? When is it useful?',
                'What is a hash index? How does it differ from B-tree based indexing?',
                'What is fill factor in indexing?',
                'What is index selectivity and how does it affect performance?'
            ]
        },
        {
            name: 'Query Optimization 17',
            resources: [
                { name: 'Query Processing – GeeksforGeeks', resource: 'https://www.geeksforgeeks.org/query-processing-in-dbms/' },
                { name: 'Query Optimization – GfG', resource: 'https://www.geeksforgeeks.org/query-optimization-in-dbms/' },
                { name: 'Video: Query Optimization', resource: 'https://www.youtube.com/watch?v=Le8efR0xTdg&t=3600s' }
            ],
            questions: [
                'Explain what query optimization is and why it is important.',
                'What is a query execution plan and how do you use it to improve performance?'
            ]
        },
        {
            name: 'Transactions & Concurrency 19',
            resources: [
                { name: 'Transactions in DBMS – GfG', resource: 'https://www.geeksforgeeks.org/transaction-processing-concepts-in-dbms/' },
                { name: 'Concurrency Control – GfG', resource: 'https://www.geeksforgeeks.org/concurrency-control-in-dbms/' },
                { name: 'Video: Transactions & Concurrency', resource: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiHRHVUtR-O52MsrdUSrzuy4' }
            ],
            questions: [
                'What is a transaction in DBMS? Give a real-world example.',
                'Explain ACID properties (Atomicity, Consistency, Isolation, Durability).',
                'What is concurrency control and why is it needed?',
                'What are shared (read) and exclusive (write) locks?',
                'What is a lock granularity (row-level, page-level, table-level)?',
                'What is a deadlock? What are common strategies to prevent or handle deadlocks?',
                'What is livelock? How does it differ from deadlock?',
                'What is a schedule in concurrency control? Differentiate between serial and concurrent schedules.',
                'What is conflict serializability?',
                'What is strict and cascadeless schedule? Why are they important for recovery?'
            ]
        },
        {
            name: 'Recovery, Logging & Reliability 18',
            resources: [
                { name: 'Recovery in DBMS – GfG', resource: 'https://www.geeksforgeeks.org/recovery-system-in-dbms/' },
                { name: 'Log-Based Recovery – GfG', resource: 'https://www.geeksforgeeks.org/log-based-recovery-in-dbms/' },
                { name: 'Video: DBMS Recovery', resource: 'https://www.youtube.com/watch?v=Le8efR0xTdg&t=4200s' }
            ],
            questions: [
                'What is a log-based recovery mechanism in DBMS?',
                'What is a checkpoint? How does it help in crash recovery?',
                'Explain the difference between immediate update and deferred update in recovery schemes.',
                'What kinds of failures can occur in a database system (transaction, system, media, user errors)?',
                'How do backup and restore strategies work in production databases?',
                'What is durability in ACID and how is it ensured at the storage level?',
                'What is RAID? Why is RAID used for database storage?',
                'What is database replication and why is it used?'
            ]
        },
        {
            name: 'Distributed Systems, Security & Performance 20',
            resources: [
                { name: 'Distributed DBMS – GfG', resource: 'https://www.geeksforgeeks.org/distributed-database/' },
                { name: 'DBMS Security – GfG', resource: 'https://www.geeksforgeeks.org/dbms-database-security/' },
                { name: 'OLTP vs OLAP – GfG', resource: 'https://www.geeksforgeeks.org/difference-between-olap-and-oltp-in-dbms/' }
            ],
            questions: [
                'Differentiate between 2-tier and 3-tier DBMS architectures.',
                'What is a distributed database? What are its main challenges?',
                'What is sharding in databases? How is it different from partitioning?',
                'Explain OLTP vs OLAP with examples.',
                'Compare SQL databases with NoSQL databases (key differences, use cases).',
                'What is a stored procedure? What are its advantages and disadvantages?',
                'What is a trigger? How is it different from a stored procedure?',
                'What is a cursor in SQL? When would you use it?',
                'What is a temporary table? How does it differ from a permanent table?',
                'What security mechanisms are commonly provided by DBMSs (authentication, authorization, encryption, auditing)?',
                'How would you design the database schema for an e-commerce application (high-level entities and relationships)?',
                'If a production DB is slow, how would you systematically debug and improve its performance?'
            ]
        }
    ];

    // Create topics and their resources
    for (const topicData of topicsWithResources) {
        const existingTopic = await topicRepo.model.findFirst({
            where: {
                name: topicData.name,
                techId: dbms.techId
            }
        });

        let topic;
        if (!existingTopic) {
            topic = await topicRepo.create({
                name: topicData.name,
                techId: dbms.techId,
                userId: adminUser.uuid
            });
            console.log(`✅ Created topic: ${topicData.name}`);
        } else {
            topic = existingTopic;
            console.log(`📝 Topic exists: ${topicData.name}`);
        }

        // Add resources to the topic
        for (const resourceData of topicData.resources) {
            const existingResource = await resourceRepo.model.findFirst({
                where: {
                    name: resourceData.name,
                    resource: resourceData.resource,
                    topicId: topic.topicId
                }
            });

            if (!existingResource) {
                await resourceRepo.create({
                    name: resourceData.name,
                    resource: resourceData.resource,
                    topicId: topic.topicId
                });
                console.log(`   ➕ Added resource: ${resourceData.name}`);
            } else {
                console.log(`   📝 Resource exists: ${resourceData.name}`);
            }
        }

        // Add questions to the topic
        for (const questionText of (topicData.questions || [])) {
            const existingQuestion = await questionRepo.model.findFirst({
                where: {
                    question: questionText,
                    topicId: topic.topicId
                }
            });

            if (!existingQuestion) {
                await questionRepo.create({
                    question: questionText,
                    topicId: topic.topicId,
                    userId: adminUser.uuid
                });
                console.log(`   ❓ Added question: ${questionText.substring(0, 50)}...`);
            } else {
                console.log(`   📝 Question exists: ${questionText.substring(0, 50)}...`);
            }
        }
    }

    console.log('🎉 DBMS topics, resources, and questions seeded successfully!');
    await prisma.$disconnect();
}

seedDbms().catch(console.error);
