Vue.component('header-navbar', {
	template: "#nav-header"
});

Vue.component('menu-navbar', {
	template: "#main-menu"
});

// 0. If using a module system (e.g. via vue-cli), import Vue and VueRouter
// and then call `Vue.use(VueRouter)`.

// 1. Define route components.
// These can be imported from other files
// const Foo = { template: '<div>foo</div>' }
// const Bar = { template: '<div>bar</div>' }

// 2. Define some routes
// Each route should map to a component. The "component" can
// either be an actual component constructor created via
// `Vue.extend()`, or just a component options object.
// We'll talk about nested routes later.
// const routes = [
  // { path: '/v3/reports/reports/outbound', component: Foo },
  // { path: '/v3/reports/reports/inbound', component: Bar }
// ]

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = new VueRouter({
  //routes, // short for `routes: routes`
  mode: 'history'
})
var base_url = $('meta[name=base_url]').attr('content');
var csrf = $('meta[name=csrf]').attr('content').split(":");      
var v = new Vue({
	router,
	el:'#app',
    data:{
        url: base_url,
        addModal: false,
        editModal:false,
        deleteModal:false,
        users:[],
        search: {text: ''},
        emptyResult:false,
        newUser:{
            firstname:'',
            lastname:'',
            gender:'',
            birthday:'',
            email:'',
            contact:'',
            address:''},
        chooseUser:{},
        formValidate:[],
        successMSG:'',        
        //pagination
        currentPage: 0,
        rowCountPage:5,
        totalUsers:0,
        pageRange:2
    },
    created(){
		this.showReportsOutbound(); 
    },
    methods:{
        // showAll(){
			// axios.get(this.url + "user/showAll").then(function(response){
				// if(response.data.users == null){
					// v.noResult()
				// } else {
					// v.getData(response.data.users);
				// }
            // })
        // },
		showReportsOutbound() {
			axios.post(this.url + "reports/outbound", {[csrf[0]]:csrf[1]}).then(function(response){
				if(response.data.users == null){
					v.noResult()
				}else{
					v.getData(response.data.users);
                    
				}  
            })
		},
		searchReportsOutbound(){
            var formData = v.formData(v.search);
			axios.post(this.url + "reports/outbound", formData).then(function(response){
				if(response.data.users == null){
					v.noResult()
				}else{
					v.getData(response.data.users);
                    
				}  
            })
        },
		addUser(){   
            var formData = v.formData(v.newUser);
			axios.post(this.url+"user/addUser", formData).then(function(response){
				if(response.data.error){
					v.formValidate = response.data.msg;
				} else {
					v.successMSG = response.data.msg;
					v.clearAll();
					v.clearMSG();
				}
			})
        },
        updateUser(){
            var formData = v.formData(v.chooseUser); axios.post(this.url+"user/updateUser", formData).then(function(response){
                if(response.data.error){
                    v.formValidate = response.data.msg;
                }else{
                      v.successMSG = response.data.success;
                    v.clearAll();
                    v.clearMSG();
                
                }
            })
        },
        deleteUser(){
             var formData = v.formData(v.chooseUser);
              axios.post(this.url+"user/deleteUser", formData).then(function(response){
                if(!response.data.error){
                     v.successMSG = response.data.success;
                    v.clearAll();
                    v.clearMSG();
                }
            })
        },
         formData(obj){
			var formData = new FormData();
		      for ( var key in obj ) {
		          formData.append(key, obj[key]);
		      } 
		      return formData;
		},
        getData(users){
            v.emptyResult = false; // become false if has a record
            v.totalUsers = users.length //get total of user
            v.users = users.slice(v.currentPage * v.rowCountPage, (v.currentPage * v.rowCountPage) + v.rowCountPage); //slice the result for pagination
            
             // if the record is empty, go back a page
            if(v.users.length == 0 && v.currentPage > 0){ 
            v.pageUpdate(v.currentPage - 1)
            v.clearAll();  
            }
        },
            
        selectUser(user){
            v.chooseUser = user; 
        },
        clearMSG(){
            setTimeout(function(){
			 v.successMSG=''
			 },3000); // disappearing message success in 2 sec
        },
        clearAll(){
            v.newUser = { 
            firstname:'',
            lastname:'',
            gender:'',
            birthday:'',
            email:'',
            contact:'',
            address:''};
            v.formValidate = false;
            v.addModal= false;
            v.editModal=false;
            v.deleteModal=false;
            v.refresh()
            
        },
        noResult(){
          
               v.emptyResult = true;  // become true if the record is empty, print 'No Record Found'
                      v.users = null 
                     v.totalUsers = 0 //remove current page if is empty
            
        },

        pickGender(gender){
           return v.newUser.gender = gender //add new user with selecting gender
        },
        changeGender(gender){
             return v.chooseUser.gender = gender //update gender
        },
        imgGender(value){
            return v.url+'assets/img/gender_'+value+'.png' //for image gender sign in the table
        },
        pageUpdate(pageNumber){
              v.currentPage = pageNumber; //receive currentPage number came from pagination template
                v.refresh()  
        },
        refresh(){
             v.search.text ? v.searchUser() : v.showAll(); //for preventing
            
        }
    }
}).$mount("#app")