#!/bin/bash

# Kits AI CLI Installation Script
# This script installs and sets up the Kits AI CLI tool

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Print colored output
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_header() {
    echo -e "${CYAN}🎵 $1 🎵${NC}"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Detect OS
detect_os() {
    case "$(uname -s)" in
        Darwin*) echo "macos" ;;
        Linux*)  echo "linux" ;;
        CYGWIN*|MINGW*) echo "windows" ;;
        *) echo "unknown" ;;
    esac
}

# Install Node.js if not present
install_nodejs() {
    if command_exists node; then
        NODE_VERSION=$(node --version)
        print_success "Node.js already installed: $NODE_VERSION"
        
        # Check if version is 16 or higher
        MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
        if [ "$MAJOR_VERSION" -lt 16 ]; then
            print_warning "Node.js version $NODE_VERSION detected. Version 16+ recommended."
            echo "Please consider upgrading Node.js for the best experience."
        fi
        return 0
    fi
    
    print_info "Node.js not found. Installing Node.js..."
    
    OS=$(detect_os)
    case $OS in
        "macos")
            if command_exists brew; then
                brew install node
            else
                print_error "Homebrew not found. Please install Node.js manually from https://nodejs.org"
                return 1
            fi
            ;;
        "linux")
            # Try different package managers
            if command_exists apt-get; then
                sudo apt-get update
                sudo apt-get install -y nodejs npm
            elif command_exists yum; then
                sudo yum install -y nodejs npm
            elif command_exists pacman; then
                sudo pacman -S nodejs npm
            else
                print_error "Package manager not found. Please install Node.js manually from https://nodejs.org"
                return 1
            fi
            ;;
        *)
            print_error "Unsupported OS. Please install Node.js manually from https://nodejs.org"
            return 1
            ;;
    esac
    
    print_success "Node.js installed successfully"
}

# Install Bun if not present
install_bun() {
    if command_exists bun; then
        BUN_VERSION=$(bun --version)
        print_success "Bun already installed: v$BUN_VERSION"
        return 0
    fi
    
    print_info "Bun not found. Installing Bun..."
    
    # Install Bun using the official installer
    curl -fsSL https://bun.sh/install | bash
    
    # Source the shell profile to make bun available
    if [ -f "$HOME/.bashrc" ]; then
        source "$HOME/.bashrc"
    elif [ -f "$HOME/.zshrc" ]; then
        source "$HOME/.zshrc"
    fi
    
    # Add to PATH if not already there
    export PATH="$HOME/.bun/bin:$PATH"
    
    if command_exists bun; then
        print_success "Bun installed successfully"
    else
        print_warning "Bun installation may require shell restart. Please restart your terminal and run 'bun --version' to verify."
    fi
}

# Install dependencies
install_dependencies() {
    print_info "Installing project dependencies..."
    
    if command_exists bun; then
        bun install
        print_success "Dependencies installed with Bun"
    elif command_exists npm; then
        npm install
        print_success "Dependencies installed with npm"
    else
        print_error "Neither Bun nor npm found. Cannot install dependencies."
        return 1
    fi
}

# Make CLI executable
make_executable() {
    print_info "Making CLI executable..."
    chmod +x index.js
    print_success "CLI is now executable"
}

# Create symlink for global access (optional)
create_global_link() {
    read -p "$(echo -e ${YELLOW}Create global 'kits-cli' command? [y/N]: ${NC})" -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        INSTALL_DIR="/usr/local/bin"
        CLI_PATH="$(pwd)/index.js"
        
        if [ -w "$INSTALL_DIR" ]; then
            ln -sf "$CLI_PATH" "$INSTALL_DIR/kits-cli"
            print_success "Global 'kits-cli' command created"
        else
            print_info "Creating global command with sudo..."
            sudo ln -sf "$CLI_PATH" "$INSTALL_DIR/kits-cli"
            print_success "Global 'kits-cli' command created"
        fi
        
        print_info "You can now use 'kits-cli' from anywhere!"
    else
        print_info "Skipping global installation. Use local commands instead."
    fi
}

# Setup API key
setup_api_key() {
    echo
    read -p "$(echo -e ${YELLOW}Do you want to set up your API key now? [y/N]: ${NC})" -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_info "Starting API key setup..."
        
        if command_exists bun; then
            bun run setup
        else
            npm run setup
        fi
    else
        print_info "Skipping API key setup. You can run 'bun run setup' later."
    fi
}

# Display completion message
show_completion() {
    echo
    print_header "Installation Complete!"
    echo
    print_success "Kits AI CLI has been successfully installed!"
    echo
    print_info "🚀 Quick Start Commands:"
    echo
    
    if command_exists bun; then
        echo -e "  ${CYAN}bun run help${NC}        - Show detailed help guide"
        echo -e "  ${CYAN}bun run dev${NC}         - Show available commands"
        echo -e "  ${CYAN}bun run interactive${NC} - Launch interactive mode"
        echo -e "  ${CYAN}bun run models${NC}      - List voice models"
        echo -e "  ${CYAN}bun run setup${NC}       - Configure API key"
    else
        echo -e "  ${CYAN}npm run help${NC}        - Show detailed help guide"
        echo -e "  ${CYAN}npm run dev${NC}         - Show available commands"
        echo -e "  ${CYAN}npm run interactive${NC} - Launch interactive mode"
        echo -e "  ${CYAN}npm run models${NC}      - List voice models"
        echo -e "  ${CYAN}npm run setup${NC}       - Configure API key"
    fi
    
    echo
    print_info "📚 Documentation:"
    echo -e "  ${CYAN}https://docs.kits.ai${NC}                 - Kits AI Documentation"
    echo -e "  ${CYAN}https://docs.kits.ai/api-reference${NC}   - API Reference"
    echo
    
    if [ ! -f ".env" ] && [ -z "$KITS_API_KEY" ]; then
        print_warning "Don't forget to set up your API key!"
        echo -e "  Get your API key: ${CYAN}https://kits.ai/api-access${NC}"
        if command_exists bun; then
            echo -e "  Run: ${CYAN}bun run setup${NC}"
        else
            echo -e "  Run: ${CYAN}npm run setup${NC}"
        fi
    fi
    
    echo
    print_success "Happy voice converting! 🎤✨"
}

# Main installation function
main() {
    print_header "Kits AI CLI Installer"
    echo
    print_info "This script will install the Kits AI CLI and its dependencies"
    echo
    
    # Check if we're in the right directory
    if [ ! -f "package.json" ] || [ ! -f "index.js" ]; then
        print_error "Installation files not found. Please run this script from the kits-ai-cli directory."
        exit 1
    fi
    
    # Install Node.js if needed
    install_nodejs || {
        print_error "Failed to install Node.js. Please install manually and try again."
        exit 1
    }
    
    # Install Bun (optional but recommended)
    print_info "Installing Bun (recommended package manager)..."
    install_bun
    
    # Install project dependencies
    install_dependencies || {
        print_error "Failed to install dependencies."
        exit 1
    }
    
    # Make CLI executable
    make_executable
    
    # Create global symlink (optional)
    create_global_link
    
    # Setup API key (optional)
    setup_api_key
    
    # Show completion message
    show_completion
}

# Run the installer
main "$@" 