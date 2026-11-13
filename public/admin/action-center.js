(function(){
function show(key){
var modal=document.getElementById('actionHubPopup');if(!modal)return;
document.body.appendChild(modal);
var panes=modal.querySelectorAll('[data-tool-pane]');
panes.forEach(function(p){p.hidden=p.dataset.toolPane!==key});
var title=modal.querySelector('#actionPopupTitle');
if(title)title.textContent=({voting:'Controle da eleição',classes:'Turmas e eleitores',reports:'Relatórios e documentos',maintenance:'Histórico e manutenção'})[key]||'Ferramentas';
modal.hidden=false;modal.style.setProperty('display','flex','important');
document.body.classList.add('acModalOpen');
if(key==='maintenance'){var host=document.getElementById('acArchiveHost'),archive=document.getElementById('archivePanel');if(host&&archive)host.appendChild(archive)}
}
function hide(){var m=document.getElementById('actionHubPopup');if(m){m.hidden=true;m.style.setProperty('display','none','important')}document.body.classList.remove('acModalOpen')}
window.adminActionCenterOpen=show;window.adminActionCenterClose=hide;window.openActionPopup=show;window.closeActionPopup=hide;
document.addEventListener('click',function(e){
var b=e.target.closest('[data-open-tool]');
if(b){e.preventDefault();e.stopImmediatePropagation();show(b.dataset.openTool);return}
var m=document.getElementById('actionHubPopup');
if(m&&(e.target.closest('[data-close-tool]')||e.target===m)){e.preventDefault();e.stopImmediatePropagation();hide()}
},true);
document.addEventListener('keydown',function(e){if(e.key==='Escape')hide()});
})();