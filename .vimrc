call plug#begin('~/.vim/plugged')
Plug 'https://gitcode.com/gh_mirrors/vi/vim-visual-multi', {'branch': 'master'}
Plug 'https://gitcode.com/gh_mirrors/co/coc.nvim.git', {'branch': 'release'}
Plug 'https://gitcode.com/gh_mirrors/vi/vimtex', { 'tag': 'v2.15' }
Plug 'https://gitcode.com/gh_mirrors/ma/markdown-preview.nvim', { 'do': 'cd app && npm install' }
call plug#end()
inoremap <silent><expr> <CR> coc#pum#visible() ? coc#pum#confirm() : "\<C-g>u\<CR>"
set number
set relativenumber
set cursorline
set tabstop=4
set shiftwidth=4
set softtabstop=4
set autoindent
set splitright
set mouse=a
set laststatus=2
set statusline=%F%m%r%h%w\ [FORMAT=%{&ff}]\ [TYPE=%Y]\ [POS=%l,%v][%p%%]\ %{strftime(\"%y/%m\/%d\ -\ %H:%M\")}

if has("gui_running")
		set background=dark
		colorscheme solarized
endif
set guifont=DejaVu\ Sans\ Mono\ 16

nnoremap <C-S-T> :vertical terminal<CR>
nnoremap <C-S-R> :source $MYVIMRC<CR>
nnoremap <C-S-S> :w<CR>

let g:coc_node_path = '/home/guosh/Apps/node-v24.21.0-linux-x64/bin/node'
let $PATH = '/home/guosh/texlive/bin/x86_64-linux:' . $PATH
let g:vimtex_view_method = 'zathura'
let g:vimtex_compiler_latexmk_engines = {'_': '-xelatex'}
