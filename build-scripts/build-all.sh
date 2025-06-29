#!/bin/bash

# Potato Chat 全平台应用构建脚本
# 使用方法: ./build-all.sh [platform] [target]
# 示例: ./build-all.sh desktop linux
#       ./build-all.sh mobile android
#       ./build-all.sh all

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 项目根目录
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DESKTOP_DIR="$PROJECT_ROOT/PotatoChatDesktop"
MOBILE_DIR="$PROJECT_ROOT/PotatoChatMobile"

# 检查目录是否存在
check_directory() {
    if [ ! -d "$1" ]; then
        log_error "目录不存在: $1"
        exit 1
    fi
}

# 构建桌面应用
build_desktop() {
    local target=$1
    log_info "开始构建桌面应用 - $target"
    
    check_directory "$DESKTOP_DIR"
    cd "$DESKTOP_DIR"
    
    # 检查依赖
    if [ ! -d "node_modules" ]; then
        log_info "安装桌面应用依赖..."
        npm install
    fi
    
    # 构建前端
    log_info "构建前端应用..."
    npm run build
    
    case $target in
        "linux")
            log_info "构建Linux桌面应用..."
            npm run build:linux
            ;;
        "windows")
            log_info "构建Windows桌面应用..."
            npm run build:win
            ;;
        "macos")
            log_info "构建macOS桌面应用..."
            npm run build:mac
            ;;
        "all")
            log_info "构建所有桌面平台..."
            npm run build:all
            ;;
        *)
            log_error "不支持的桌面平台: $target"
            log_info "支持的平台: linux, windows, macos, all"
            exit 1
            ;;
    esac
    
    log_success "桌面应用构建完成 - $target"
}

# 构建移动应用
build_mobile() {
    local target=$1
    log_info "开始构建移动应用 - $target"
    
    check_directory "$MOBILE_DIR"
    cd "$MOBILE_DIR"
    
    # 检查依赖
    if [ ! -d "node_modules" ]; then
        log_info "安装移动应用依赖..."
        npm install
    fi
    
    case $target in
        "android")
            log_info "构建Android应用..."
            if [ -d "android" ]; then
                cd android
                chmod +x gradlew
                ./gradlew assembleRelease
                cd ..
                log_success "Android APK构建完成"
                log_info "APK位置: android/app/build/outputs/apk/release/"
            else
                log_error "Android项目目录不存在"
                exit 1
            fi
            ;;
        "ios")
            log_info "构建iOS应用..."
            if [ "$(uname)" != "Darwin" ]; then
                log_warning "iOS构建需要macOS环境"
                exit 1
            fi
            npm run build:ios
            ;;
        "all")
            log_info "构建所有移动平台..."
            build_mobile "android"
            if [ "$(uname)" = "Darwin" ]; then
                build_mobile "ios"
            else
                log_warning "跳过iOS构建 (需要macOS环境)"
            fi
            ;;
        *)
            log_error "不支持的移动平台: $target"
            log_info "支持的平台: android, ios, all"
            exit 1
            ;;
    esac
    
    log_success "移动应用构建完成 - $target"
}

# 显示帮助信息
show_help() {
    echo "Potato Chat 全平台应用构建脚本"
    echo ""
    echo "使用方法:"
    echo "  $0 [platform] [target]"
    echo ""
    echo "平台选项:"
    echo "  desktop [target]  构建桌面应用"
    echo "    - linux         Linux AppImage + DEB"
    echo "    - windows       Windows EXE + ZIP"
    echo "    - macos         macOS DMG + ZIP"
    echo "    - all           所有桌面平台"
    echo ""
    echo "  mobile [target]   构建移动应用"
    echo "    - android       Android APK"
    echo "    - ios           iOS应用 (需要macOS)"
    echo "    - all           所有移动平台"
    echo ""
    echo "  all               构建所有平台应用"
    echo ""
    echo "示例:"
    echo "  $0 desktop linux"
    echo "  $0 mobile android"
    echo "  $0 all"
}

# 构建所有平台
build_all() {
    log_info "开始构建所有平台应用..."
    
    # 构建桌面应用
    build_desktop "linux"
    
    # 尝试构建Windows (可能失败)
    if build_desktop "windows" 2>/dev/null; then
        log_success "Windows桌面应用构建成功"
    else
        log_warning "Windows桌面应用构建失败 (可能需要wine环境)"
    fi
    
    # 尝试构建macOS (可能失败)
    if build_desktop "macos" 2>/dev/null; then
        log_success "macOS桌面应用构建成功"
    else
        log_warning "macOS桌面应用构建失败 (可能需要macOS环境)"
    fi
    
    # 构建移动应用
    build_mobile "android"
    
    log_success "全平台应用构建完成！"
}

# 显示构建结果
show_results() {
    log_info "构建结果总览:"
    
    # 桌面应用结果
    if [ -d "$DESKTOP_DIR/dist" ]; then
        log_info "桌面应用构建产物:"
        ls -la "$DESKTOP_DIR/dist/" | grep -E '\.(AppImage|deb|exe|zip|dmg)$' || log_warning "未找到桌面应用构建产物"
    fi
    
    # 移动应用结果
    if [ -d "$MOBILE_DIR/android/app/build/outputs/apk/release" ]; then
        log_info "Android应用构建产物:"
        ls -la "$MOBILE_DIR/android/app/build/outputs/apk/release/" | grep '\.apk$' || log_warning "未找到Android APK文件"
    fi
}

# 主函数
main() {
    local platform=$1
    local target=$2
    
    log_info "Potato Chat 全平台应用构建开始..."
    log_info "项目根目录: $PROJECT_ROOT"
    
    case $platform in
        "desktop")
            if [ -z "$target" ]; then
                log_error "请指定桌面平台目标"
                show_help
                exit 1
            fi
            build_desktop "$target"
            ;;
        "mobile")
            if [ -z "$target" ]; then
                log_error "请指定移动平台目标"
                show_help
                exit 1
            fi
            build_mobile "$target"
            ;;
        "all")
            build_all
            ;;
        "help"|"-h"|"--help"|"")
            show_help
            exit 0
            ;;
        *)
            log_error "不支持的平台: $platform"
            show_help
            exit 1
            ;;
    esac
    
    show_results
    log_success "构建任务完成！"
}

# 执行主函数
main "$@"

