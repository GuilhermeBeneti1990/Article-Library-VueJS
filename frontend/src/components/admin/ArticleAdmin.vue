<template>
    <div class="article-admin">
        <b-form>
            <input type="hidden" id="article-id" v-model="article.id">
    
            <b-form-group label="Name" label-for="article-name">
                <b-form-input id="article-name" type="text" v-model="article.name" required :readonly="mode === 'remove'" placeholder="Article..."></b-form-input>
            </b-form-group>

            <b-form-group label="Description" label-for="article-description">
                <b-form-input id="article-description" type="text" v-model="article.description" required :readonly="mode === 'remove'" placeholder="Tell me what you are this article..."></b-form-input>
            </b-form-group>

            <b-form-group v-if="mode === 'save'" label="Image (URL)" label-for="article-imageUrl">
                <b-form-input id="article-imageUrl" type="text" v-model="article.imageUrl" required :readonly="mode === 'remove'" placeholder="Type the URL of image..."></b-form-input>
            </b-form-group>

            <b-form-group v-if="mode === 'save'" label="Category" label-for="article-categoryId">
                <b-form-select id="article-categoryId" :options="categories" v-model="article.categoryId"></b-form-select>
            </b-form-group>

            <b-form-group v-if="mode === 'save'" label="Author" label-for="article-userId">
                <b-form-select id="article-userId" :options="users" v-model="article.userId"></b-form-select>
            </b-form-group>

            <b-form-group v-if="mode === 'save'" label="Content" label-for="article-content">
                <VueEditor v-model="article.content" placeholder="Type the content of your article" />
            </b-form-group>
        
            <b-button variant="primary" v-if="mode === 'save'" @click="save">Save</b-button>
            <b-button variant="danger" v-if="mode === 'remove'" @click="remove">Remove</b-button>
            <b-button class="ml-2" @click="reset">Cancel</b-button>
                
        </b-form>
        <hr>
        <b-table hover stripped :items="articles" :fields="fields">
            <template slot="actions" slot-scope="data">
                <b-button variant="warning" @click="loadArticle(data.item)" class="mr-2">
                    <i class="fa fa-pencil"></i>
                </b-button>
                <b-button variant="danger" @click="loadArticle(data.item, 'remove')">
                    <i class="fa fa-trash"></i>
                </b-button>
            </template>
        </b-table>
        <b-pagination size="md" v-model="page" :total-rows="count" :per-page="limit"></b-pagination>
    </div>
</template>

<script>
import { VueEditor } from 'vue2-editor'
import { baseApiUrl, showError } from '@/global'
import axios from 'axios'

export default {
    name: 'ArticleAdmin',
    components: { VueEditor },
    data: function() {
        return {
            mode: 'save',
            article: {},
            articles: [],
            categories: [],
            users: [],
            page: 1,
            limit: 0,
            count: 0,
            fields: [
                { key: 'id', label: 'Code', sortable: true},
                { key: 'name', label: 'Name', sortable: true},
                { key: 'description', label: 'Description', sortable: true},
                { key: 'actions', label: 'Actions'}
            ]
        }
    },
    methods: {
        loadArticles() {
            const url = `${baseApiUrl}/articles?page=${this.page}`
            axios.get(url).then(res => {
                this.articles = res.data.data
                this.count = res.data.count
                this.limit = res.data.limit
            })
        },
        reset() {
            this.mode = 'save'
            this.article = {}
            this.loadArticles()
        },
        save() {
            const method = this.article.id ? 'put' : 'post'
            const id = this.article.id ? `/${this.article.id}` : ''
            axios[method](`${baseApiUrl}/articles${id}`, this.article)
                .then(() => {
                    this.$toasted.global.defaultSuccess()
                    this.reset()
                })
                .catch(showError)
        },
        remove() {
            const id = this.article.id
            axios.delete(`${baseApiUrl}/articles/${id}`)
                .then(() => {
                    this.$toasted.global.defaultSuccess()
                    this.reset()
                })
                .catch(showError)
        },
        loadArticle(article, mode = 'save') {
            this.mode = mode
            axios.get(`${baseApiUrl}/articles/${article.id}`)
                .then(res => this.article = res.data)
        },
        loadCategories() {
            const url = `${baseApiUrl}/categories`
            axios.get(url)
                .then(res => { this.categories = res.data.map(category => { return { value: category.id, text: category.path } })})
        },
        loadUsers() {
            const url = `${baseApiUrl}/users`
            axios.get(url)
                .then(res => { this.users = res.data.map(user => { return { value: user.id, text: `${user.name} - ${user.email}` } })})
        }
    },
    watch: {
        page() {
            this.loadArticles()
        }
    },
    mounted() {
        this.loadUsers()
        this.loadCategories()
        this.loadArticles()
    }
}
</script>

<style>

</style>
