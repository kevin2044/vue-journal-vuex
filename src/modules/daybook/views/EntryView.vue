<template>
    <template v-if="entry">
        <div class="entry-title d-flex justify-content-between p-2">
            <div>
                <span class="text-success fs-3 fw-bold">{{ day }}</span>
                <span class="mx-1 fs-3">{{ month }}</span>
                <span class="mx-2 fs-4 fw-light">{{ yearDay }}</span>
            </div>
            <div>
                <input type="file" @change="onSelectedImage" ref="imageSelector" v-show="false" accept="image/png, image/jpeg, image/jpg">
                <button v-if="entry.id" class="btn btn-danger mx-2" @click="onDeleteEntry">
                    Borrar <i class="fa fa-trash-alt"></i>
                </button>

                <button class="btn btn-primary" @click="onSelectImage">
                    Subir foto <i class="fa fa-upload"></i>
                </button>
            </div>
        </div>
        <hr>
        <div class="d-flex flex-column px-3 h-75">
            <textarea placeholder="Que sucedio hoy?" v-model="entry.text"></textarea>
        </div>
        <Fab icon="fa-save" @on:click="saveEntry" />
        <!-- <img src="https://concepto.de/wp-content/uploads/2015/03/paisaje-e1549600034372.jpg" alt="entry-picture" class="img-thumbnail"> -->
        <img v-if="entry.picture && !localImage" :src="entry.picture" alt="entry-picture" class="img-thumbnail">
        <img v-if="localImage" :src="localImage" alt="entry-picture" class="img-thumbnail">
    </template>
</template>

<script>
import Swal from 'sweetalert2'
import { defineAsyncComponent } from 'vue'
import { mapGetters, mapActions } from 'vuex'

import getDayMonthYear from '../helpers/getDayMonthYear'
import uploadImage from '../helpers/uploadImage'

export default {
    props:{
        id: {
            type: String,
            required: true,
        }
    },
    components:{
        Fab: defineAsyncComponent(() => import('../components/Fab.vue'))
    },
    data(){
        return {
            entry: null,
            localImage: null,
            file: null,
        }
    },
    computed:{
        ...mapGetters('journal', ['getEntryById']),
        day(){
            const { day } = getDayMonthYear(this.entry.date)
            return day
        },
        month(){
            const { month } = getDayMonthYear(this.entry.date)
            return month
        },
        yearDay(){
            const { yearDay } = getDayMonthYear(this.entry.date)
            return yearDay
        },
    },
    methods:{
        loadEntry(){
            let entry;
            if(this.id === 'new'){
                entry = {
                    text: '',
                    date: new Date().getTime()
                }
            }else{
                //getEntryById
                entry = this.getEntryById(this.id)
                console.log(entry)
                if(!entry){
                    this.$router.push({ name: 'no-entry'})
                }
            }
            this.entry = entry
        },
        ...mapActions('journal', ['updateEntry', 'createEntry', 'deleteEntry']),
        async saveEntry(){
            new Swal({
                title: 'Esperen por favor',
                allowOutsideClick: false,
            })
            Swal.showLoading()
            const picture = await uploadImage(this.file)
            this.entry.picture = picture
            if(this.entry.id){
                await this.updateEntry(this.entry)
            }else{
                /////
                //crear nueva entrada
                console.log("POST NUEVA ENTRADA");
                //await action
                const id = await this.createEntry(this.entry)
                //redirect => entry, params: id
                this.$router.push({ name: 'entry', params: { id: id } })
            }
            this.file = null
            Swal.fire('Guardado', 'Entrada registrada con Exito', 'success')
        },
        async onDeleteEntry(){
            const result = await Swal.fire({
                title: 'Estas seguro?',
                text: 'Una vez borrado, no se puede recuperar',
                showDenyButton: true,
                confirmButtonText: 'Si estoy seguro'
            })
            console.log({result});
            if(result.isConfirmed){
                new Swal({
                    title: 'Espere por favor',
                    allowOutsideClick: false
                })
                Swal.showLoading()
                console.log("delete", this.entry)
                await this.deleteEntry(this.entry.id)
                this.$router.push({ name: 'no-entry' })
                Swal.fire('Eliminado','','success')
            }
        },
        onSelectedImage(event){
            console.log(event.target.files[0])
            const file = event.target.files[0]
            if(!file){
                this.localImage = null
                this.file = null
                return
            }
            this.file = file
            const fr = new FileReader()
            fr.onload = () => this.localImage = fr.result
            fr.readAsDataURL(file)
        },
        onSelectImage(){
            this.$refs.imageSelector.click()
        }
    },
    created(){
        console.log(this.id)
        this.loadEntry()
    },
    watch:{
        id(value, oldValue){
            console.log({value, oldValue})
            this.loadEntry()
        }
    }
}
</script>

<style lang="scss" scoped>
textarea{
    font-size: 20px;
    border: none;
    height: 100%;
    &:focus{
        outline: none;
    }
}
img{
    width: 200px;
    position: fixed;
    bottom: 150px;
    right: 20px;
    box-shadow: 0px 5px 10px rgba($color: #000000, $alpha: 0.2);
}
</style>