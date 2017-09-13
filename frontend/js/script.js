var f = document.form;
f.addEventListener('invalid', (function(){
    return function(e) {
        //prevent the browser from showing default error bubble / hint
        e.preventDefault();
    };
})(), true);
f.email.addEventListener('focus', function() {
    this.classList.remove('invalid', 'submitted');
});
f.email.addEventListener('blur', function() {
    if (!this.checkValidity()) {
        this.classList.add('invalid');
    }
});
f.addEventListener('submit', function(e){
    this.classList.remove('invalid');
    this.classList.add('submitted');
    e.preventDefault();
}, true);