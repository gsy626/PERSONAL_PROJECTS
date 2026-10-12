call plug#begin('~/.vim/plugged')
Plug 'https://gitcode.com/gh_mirrors/vi/vim-visual-multi', {'branch': 'master'}
Plug 'https://gitcode.com/gh_mirrors/co/coc.nvim.git', {'branch': 'release'}
call plug#end()
inoremap <silent><expr> <CR> coc#pum#visible() ? coc#pum#confirm() : "\<C-g>u\<CR>"

set number
set relativenumber
set cursorline
set tabstop=4
set autoindent
set splitright
set mouse=a
set laststatus=2
set statusline=%F%m%r%h%w\ [FORMAT=%{&ff}]\ [TYPE=%Y]\ [POS=%l,%v][%p%%]\ %{strftime(\"%d/%m/%y\ -\ %H:%M\")}

set background=dark
colorscheme solarized
set guifont=DejaVu\ Sans\ Mono\ 16

nnoremap <C-S-T> :vertical terminal<CR>
nnoremap <C-S-S> :w<CR>


