pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'facedrop-frontend'
        DOCKER_TAG = "${BUILD_NUMBER}"
        DOCKER_REPO = 'mouse69/facedrop'
        DOCKER_REGISTRY = 'docker.io'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            steps {
                sh 'docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} .'
            }
        }

        // stage('Security Scan') {
        //     steps {
        //         // Add security scanning steps here
        //         sh 'docker scan ${DOCKER_IMAGE}:${DOCKER_TAG}'
        //     }
        // }

        stage('Push to Registry') {
            steps {
                script {
                    // Login to Docker registry (configure credentials in Jenkins)
                    withCredentials([usernamePassword(credentialsId: 'docker-registry-credentials', 
                                    usernameVariable: 'DOCKER_USER', 
                                    passwordVariable: 'DOCKER_PASS')]) {
                        sh 'echo $DOCKER_PASS | docker login $DOCKER_REGISTRY -u $DOCKER_USER --password-stdin'
                        sh 'docker tag $DOCKER_IMAGE:$DOCKER_TAG $DOCKER_REPO/$DOCKER_IMAGE:$DOCKER_TAG'
                        sh 'docker push $DOCKER_REPO/$DOCKER_IMAGE:$DOCKER_TAG'
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    // Add deployment steps here
                    // This could be kubectl apply, docker-compose up, etc.
                    sh '''
                        # Example deployment commands
                        # kubectl set image deployment/facedrop-frontend frontend=${DOCKER_REPO}/${DOCKER_IMAGE}:${DOCKER_TAG}
                        # kubectl rollout status deployment/facedrop-frontend
                    '''
                }
            }
        }
    }

    post {
        always {
            // Clean up Docker images
            sh 'docker rmi ${DOCKER_IMAGE}:${DOCKER_TAG} || true'
            sh 'docker rmi ${DOCKER_REPO}/${DOCKER_IMAGE}:${DOCKER_TAG} || true'
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
} 