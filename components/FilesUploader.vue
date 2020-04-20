<template>
  <section>
    <div class="columns">
      <div>
        <drop-zone />
      </div>
      <div>
        <div class="into">
          <div class="columns">
            <div class="full-title">
              <h2>Pangolin COVID-19<br>Lineage Assigner</h2>
              <h3>Phylogenetic Assignment of Named Global Outbreak LINeages</h3>
            </div>
            <div class="logo">
              <img title="Pangolin" src="/images/logo.png">
            </div>
          </div>
          <p>
            You can upload one or more sequences by dragging and dropping the a (multi)fasta file or clicking “Select files to upload” and selecting a (multi)fasta file.
          </p>
          <p>
            This Web Application assigns lineages to COVID-19 sequenes based on the methodology described in this <a href="http://virological.org/t/a-dynamic-nomenclature-for-sars-cov-2-to-assist-genomic-epidemiology/458">article</a>
          </p>
          <p>
            The software to assign lineages based on this algoritm was developed by <a href="https://github.com/aineniamh">Áine O'Toole</a>, <a href="https://github.com/jtmccr1">JT McCrone</a> and <a href="https://github.com/rambaut">Andrew Rambaut</a>. The source code can be found <a href="https://github.com/hCoV-2019/pangolin">here</a>
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import DropZone from "./DropZone.vue";

export default {
  components: {
    DropZone,
  },
};
</script>

<style scoped>
.columns {
  display: flex;
  flex-direction: column;
}

.into {
  padding: 0 24px;
  text-align: left;
}

.into h2 {
  font-size: 24px;
  padding-bottom: 8px;
  font-weight: 700;
}

.into p {
  line-height: 1.75;
  margin-top: 16px;
}

.columns > div.full-title {
  width:auto;
}

.columns > div.logo {
  width:85px;
}

.columns > div.logo img { 
  height: 120px;
}

@media (min-width:768px) {
  .columns {
    flex-direction: row;
  }
  .columns > div {
    width: 50%;
  }
}
</style>
