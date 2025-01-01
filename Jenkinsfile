pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials-id')
        SONAR_TOKEN = credentials('sonar-token-id')
        SONAR_HOST_URL = credentials('sonar-host-url')
        SLACK_WEBHOOK = credentials('slack-webhook-id')
    }

    tools {
        nodejs 'nodejs-tool' // Match the name you set in NodeJS configuration
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', 
                url: 'https://github.com/FH-Technikum-Wien-Ruslan-Kotliarenko/ci-todo-frontend'
            }
        }
        // stage('Install Dependencies') {
        //     steps {
        //         sh 'npm install'
        //     }
        // }
        // stage('Lint') {
        //     steps {
        //         sh 'npm run lint'
        //     }
        // }
        // stage('Test') {
        //     steps {
        //         sh 'npm run test'
        //     }
        // }
        // stage('SonarQube Analysis') {
        //     steps {
        //         script { 
        //             withSonarQubeEnv('sonar-scanner-installation') {
        //                 sh "${tool('sonar-scanner-tool')}/bin/sonar-scanner \
        //                     -Dsonar.projectKey=ci-todo-frontend \
        //                     -Dsonar.sources=. \
        //                     -Dsonar.host.url=${SONAR_HOST_URL} \
        //                     -Dsonar.login=${SONAR_TOKEN}"
        //             }
        //         }
        //     }
        // }
        // stage('Snyk Security Scan') {
        //     steps {
        //         echo 'Testing...'
        //         snykSecurity(
        //             snykInstallation: 'snyk-tool',
        //             snykTokenId: 'snyk-token-id'
        //         )
        //     }
        // }
        stage('Build Docker Image') {
            agent any
            steps {
                sh "docker build --platform linux/amd64 -t ruslankotliar/ci-todo-frontend:${GIT_COMMIT} ."
            }
        }
        stage('Push Docker Image') {
            steps {
                withDockerRegistry([credentialsId: 'dockerhub-credentials-id', url: 'https://index.docker.io/v1/']) {
                    sh "docker push ruslankotliar/ci-todo-frontend:${GIT_COMMIT}"
                }
            }
        }
    //     stage('Deploy to AWS') {
    //         steps {
    //             sshPublisher(
    //                 publishers: [
    //                     sshPublisherDesc(
    //                         configName: 'aws-ec2',
    //                         transfers: [
    //                             sshTransfer(
    //                                 execCommand: """
    //                                     cd app
    //                                     docker-compose pull frontend
    //                                     docker-compose up -d frontend
    //                                 """
    //                             )
    //                         ],
    //                         usePromotionTimestamp: false,
    //                         verbose: true
    //                     )
    //                 ]
    //             )
    //         }
    //     }
    // }

    // post {
    //     failure {
    //         slackSend (
    //             channel: '#ci-cd-notifications',
    //             color: 'danger',
    //             message: "Frontend CI pipeline failed for commit ${env.GIT_COMMIT}"
    //         )
    //     }
    }
}
