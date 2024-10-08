<template>
    <div>
        <v-card max-width="1200px" height="900px" class="pa-4" border>
            <v-card-title> CSFD task </v-card-title>
            <v-card-text>
                <v-text-field
                    v-model="search"
                    label="Search"
                    prepend-inner-icon="mdi-magnify"
                    variant="outlined"
                    @keyup.enter="handleEnterClick"
                    placeholder="Click search o press Enter key"
                    :active="true"
                >
                    <template #append>
                        <v-btn variant="outlined" @click="fetchDataByFilter"> Search </v-btn>
                    </template>
                </v-text-field>
            </v-card-text>
            <v-card-subtitle class="text-left">
                {{ filmCount }} films and {{ actorCount }} actors were found.
                <br />
                (The maximum number of displayed records is 300 for each table)
            </v-card-subtitle>
            <v-card-item>
                <v-row>
                    <v-col>
                        <v-data-table :items="films" :headers="filmHeaders" height="600px">
                            <template v-slot:item.name="{ item }">
                                <v-btn variant="text" @click="fetchDetail(item.id, 'film')">{{
                                    item.name
                                }}</v-btn>
                            </template>
                        </v-data-table>
                    </v-col>
                    <v-col>
                        <v-data-table :items="actors" :headers="actorHeaders" height="600px">
                            <template v-slot:item.name="{ item }">
                                <v-btn variant="text" @click="fetchDetail(item.id, 'actor')">{{
                                    item.name
                                }}</v-btn>
                            </template>
                        </v-data-table>
                    </v-col>
                </v-row>
            </v-card-item>
        </v-card>

        <!-- Film or Actor detail -->
        <DetailDialog ref="detailDialogRef" :detail="itemDetail" />
    </div>
</template>

<script>
import { getServiceUrl, getUrlWithFilterWithFilter } from './helpers.js'
import DetailDialog from './components/DetailDialog.vue'

export default {
    name: 'App',
    components: { DetailDialog },
    setup() {},
    data: () => ({
        itemDetail: {},
        search: '',
        filter: {},
        actors: [],
        actorCount: 0,
        actorHeaders: [{ title: 'Actors', key: 'name', align: 'center' }],
        films: [],
        filmCount: 0,
        filmHeaders: [{ title: 'Films', key: 'name', align: 'center' }]
    }),
    computed: {},
    mounted() {},
    watch: {},
    methods: {
        async fetchFilms() {
            const url = getUrlWithFilterWithFilter('film', this.filter)
            const response = await fetch(url, {
                method: 'GET',
                mode: 'cors'
            })

            if (response.ok) {
                const data = await response.json()
                this.films = data['results']
                this.filmCount = data['count']
            }
        },
        async fetchActors() {
            const url = getUrlWithFilterWithFilter('actor', this.filter)
            const response = await fetch(url, {
                method: 'GET',
                mode: 'cors'
            })

            if (response.ok) {
                const data = await response.json()
                this.actors = data['results']
                this.actorCount = data['count']
            }
        },
        async fetchDataByFilter() {
            this.filter.search = this.search
            await this.fetchFilms()
            await this.fetchActors()
            this.filter = {}
        },
        async fetchDetail(filmOrActorId, filmOrActor) {
            const url = getServiceUrl(filmOrActor + '/' + filmOrActorId.toString())
            const response = await fetch(url, {
                method: 'GET',
                mode: 'cors'
            })

            if (response.ok) {
                this.itemDetail.type = filmOrActor
                this.itemDetail.data = await response.json()
            }

            this.$refs.detailDialogRef.open()
        },
        async handleEnterClick() {
            await this.fetchDataByFilter()
        }
    }
}
</script>

<style></style>
