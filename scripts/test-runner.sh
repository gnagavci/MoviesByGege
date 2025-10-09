#!/bin/bash

# Enhanced test runner for Docker containerized testing
# This script demonstrates different testing strategies with Docker

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to clean up containers and volumes
cleanup() {
    print_status "Cleaning up Docker resources..."
    docker compose -f docker-compose.test.yml down -v 2>/dev/null || true
    docker system prune -f 2>/dev/null || true
    rm -rf test-results/* 2>/dev/null || true
}

# Function to check if Docker is running
check_docker() {
    if ! docker info >/dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
    print_status "Docker is running ✓"
}

# Function to run specific test type
run_test_type() {
    local test_type=$1
    local description=$2
    
    print_status "Running $description..."
    echo "===========================================" 
    
    case $test_type in
        "unit-backend")
            docker compose -f docker-compose.test.yml up --build test-backend-unit --abort-on-container-exit
            ;;
        "unit-frontend")
            docker compose -f docker-compose.test.yml up --build test-frontend-unit --abort-on-container-exit
            ;;
        "performance")
            docker compose -f docker-compose.test.yml up --build test-frontend-performance --abort-on-container-exit
            ;;
        "e2e")
            docker compose -f docker-compose.test.yml up --build backend-test frontend test-e2e --abort-on-container-exit
            ;;
        "all")
            docker compose -f docker-compose.test.yml up --build --abort-on-container-exit
            ;;
    esac
    
    local exit_code=$?
    if [ $exit_code -eq 0 ]; then
        print_status "$description completed successfully ✓"
    else
        print_error "$description failed with exit code $exit_code ✗"
        return $exit_code
    fi
}

# Function to collect test results
collect_results() {
    print_status "Collecting test results..."
    
    # Create results directory structure
    mkdir -p test-results/{backend,frontend,e2e,performance}
    
    # Copy coverage reports and test artifacts
    docker compose -f docker-compose.test.yml run --rm test-backend-unit sh -c "cp -r coverage/* /app/test-results/backend/ 2>/dev/null || true"
    docker compose -f docker-compose.test.yml run --rm test-frontend-unit sh -c "cp -r coverage/* /app/test-results/frontend/ 2>/dev/null || true"
    
    print_status "Test results collected in ./test-results/"
}

# Main execution
main() {
    echo "============================================"
    echo "Docker Containerized Testing Demo"
    echo "============================================"
    
    # Check prerequisites
    check_docker
    
    # Clean up previous runs
    cleanup
    
    # Parse command line arguments
    case ${1:-"all"} in
        "backend"|"unit-backend")
            run_test_type "unit-backend" "Backend Unit Tests"
            ;;
        "frontend"|"unit-frontend")
            run_test_type "unit-frontend" "Frontend Unit Tests"
            ;;
        "performance")
            run_test_type "performance" "Frontend Performance Tests"
            ;;
        "e2e")
            run_test_type "e2e" "End-to-End Tests"
            ;;
        "contract")
            print_status "Contract tests are included in backend unit tests"
            run_test_type "unit-backend" "Backend Unit & Contract Tests"
            ;;
        "all")
            print_status "Running comprehensive test suite..."
            run_test_type "unit-backend" "Backend Unit Tests" && \
            run_test_type "unit-frontend" "Frontend Unit Tests" && \
            run_test_type "performance" "Performance Tests" && \
            run_test_type "e2e" "End-to-End Tests"
            ;;
        "clean")
            cleanup
            print_status "Cleanup completed"
            exit 0
            ;;
        "help"|"-h"|"--help")
            echo "Usage: $0 [test-type]"
            echo ""
            echo "Available test types:"
            echo "  backend      - Run backend unit tests"
            echo "  frontend     - Run frontend unit tests" 
            echo "  performance  - Run performance tests"
            echo "  e2e          - Run end-to-end tests"
            echo "  contract     - Run contract tests"
            echo "  all          - Run all tests (default)"
            echo "  clean        - Clean up Docker resources"
            echo "  help         - Show this help message"
            exit 0
            ;;
        *)
            print_error "Unknown test type: $1"
            print_status "Use '$0 help' for available options"
            exit 1
            ;;
    esac
    
    # Collect results if tests were run
    if [ "$1" != "clean" ] && [ "$1" != "help" ]; then
        collect_results
    fi
    
    print_status "Test execution completed!"
}

# Run main function with all arguments
main "$@"