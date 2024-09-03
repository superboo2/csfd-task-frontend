<template>
    <div>
        <v-dialog v-model="dialog">
            <v-card max-width="600" class="pa-4 ma-auto">
                <v-card-title>
                    {{ itemDetail.data.name }}
                    <a :href="itemDetail.data.url" target="_blank">(CSFD)</a>
                </v-card-title>

                <v-card-subtitle>
                    <div v-if="itemDetail.type === 'film'">
                        <div>CSFD number: {{ itemDetail.data.film_number }}</div>
                        <div>Year: {{ itemDetail.data.year }}</div>
                        <div>Rating: {{ itemDetail.data.rating }}</div>
                    </div>
                    <div v-else>
                        <div>CSFD number: {{ itemDetail.data.actor_number }}</div>
                    </div>
                </v-card-subtitle>

                <v-card-subtitle class="font-weight-bold mt-4">
                    {{ itemDetail.type === 'film' ? 'Actors: ' : 'Films: ' }}
                </v-card-subtitle>

                <v-card-text>
                    <v-data-table
                        :items="
                            itemDetail.type === 'film'
                                ? itemDetail.data.actors
                                : itemDetail.data.films
                        "
                    >
                        <template v-slot:item.name="{ item }">
                            <v-btn
                                variant="text"
                                @click="
                                    fetchDetail(
                                        item.id,
                                        itemDetail.type === 'film' ? 'actor' : 'film'
                                    )
                                "
                                >{{ item.name }}</v-btn
                            >
                        </template>
                    </v-data-table>
                </v-card-text>

                <template v-slot:actions>
                    <v-btn class="ms-auto" text="Ok" @click="cancel"></v-btn>
                </template>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import { getServiceUrl } from '../helpers.js'

export default {
    name: 'DetailDialog',
    props: {
        detail: Object
    },
    data: () => ({
        dialog: false,
        itemDetail: {}
    }),
    methods: {
        open() {
            this.dialog = true
            this.itemDetail = this.detail
        },
        cancel() {
            this.dialog = false
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
        }
    }
}
</script>
