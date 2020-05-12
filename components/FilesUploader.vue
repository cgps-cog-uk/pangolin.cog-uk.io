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
            You can upload one or more sequences by dragging and dropping a (multi)fasta file or clicking “Select fasta file to upload” and selecting a (multi)fasta file.
          </p>
          <p>
            This Web Application assigns lineages to COVID-19 sequenes based on the methodology described in this <a href="https://www.biorxiv.org/content/10.1101/2020.04.17.046086v1">article</a>
          </p>
          <p>
            The software to assign lineages based on the algorithm that was developed by <a href="https://github.com/aineniamh">Áine O'Toole</a>, <a href="https://github.com/ViralVerity">Verity Hill</a>, <a href="https://github.com/jtmccr1">JT McCrone</a> and <a href="https://github.com/rambaut">Andrew Rambaut</a>. The source code can be found <a href="https://github.com/hCoV-2019/pangolin">here</a>
          </p>
          <p class="recommended-browsers align-center justify-left row">
            Recommended browsers<img title="Chrome" src="/images/chrome.png" class="browser-logo"><img title="Firefox" src="/images/firefox.png" class="browser-logo">or<img title="Safari" src="/images/safari.png" class="browser-logo">
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

.recommended-browsers {
  margin: 0px;
}

.browser-logo {
  height: 32px;
  padding-left: 5px;
  padding-right: 5px;
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
