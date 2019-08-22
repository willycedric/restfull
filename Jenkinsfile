pipeline {
    agent {
            label 'docker'
    }
    environment {
            USER_NAMED = 'WILLY'
    }
    stages {
        stage('Build') {
            steps {
                sh 'printenv'
            }
        }
        stage('One') {
                steps {
                       
                        echo USER_NAMED
			
                }
        }
	    stage('Two'){
		    
		steps {
			input('Do you want to proceed?')
        }
	    }
        stage('Three') {
                when {
                        not {
                                branch "master"
                        }
                }
                steps {
			echo "Hello"
                        }
        }
        stage('Four') {
                parallel {
                        stage('Unit Test') {
                                steps{
                                        echo "Running the unit test..."
                                }
                        }
                        stage('Integration test') {
                        // agent {
                        //         docker {
                        //                 reuseNode true
			// 		image 'ubuntu'
                        //         }
			// }
				steps {
					echo 'Running the integration test..'
				}                               
			}  }
        }
    }
}