let ref = document.getElementById("ref").value;
let hyp = document.getElementById("hyp").value;
let res = document.getElementById("res");
let finalhyp = document.getElementById("finalhyp");

function edit_distance(str1, str2) {
  let len1 = str1.length;
  let len2 = str2.length;
  let DP = new Array(2);
  for (let i = 0; i < 2; i++) {
    DP[i] = new Array(len1 + 1);
    for (let j = 0; j < len1 + 1; j++) DP[i][j] = 0;
  }
  for (let i = 0; i <= len1; i++) DP[0][i] = i;

  for (let i = 1; i <= len2; i++) {
    for (let j = 0; j <= len1; j++) {
      if (j == 0) DP[i % 2][j] = i;
      else if (str1[j - 1] == str2[i - 1]) {
        DP[i % 2][j] = DP[(i - 1) % 2][j - 1];
      } else {
        DP[i % 2][j] =
          1 +
          Math.min(
            DP[(i - 1) % 2][j],
            Math.min(DP[i % 2][j - 1], DP[(i - 1) % 2][j - 1])
          );
      }
    }
  }

  return DP[len2 % 2][len1];
}
function shifting_op(hyp, ref) {
  let edit_distance_original = edit_distance(hyp, ref);
  console.log(edit_distance_original);
  let hypothesis_length = hyp.length;
  let reference_length = ref.length;
  let sentences = [];
  for (let i = 0; i < hypothesis_length; i++) {
    for (let j = 0; j < reference_length; j++) {
      if (i != j && hyp[i] === ref[j]) {
        let len = 0;

        for (
          let p = i, q = j;
          p < hypothesis_length && q < reference_length;
          p++, q++
        ) {
          if (hyp[p] != ref[q]) break;
          len += 1;
        }

        let op = [];
        for (let m = 0; m < i; m++) {
          op.push(hyp[m]);
        }

        for (let m = i + len; m < hypothesis_length; m++) {
          op.push(hyp[m]);
        }
        let pp = j;
        for (let m = i; m < i + len; m++) {
          op.splice(pp, 0, hyp[m]);
          pp++;
        }
        sentences.push(op);
      }
    }
  }
  let score = [];
  console.log(hyp);
  console.log(sentences);
  for (let i = 0; i < sentences.length; i++) {
    let resultant = edit_distance(sentences[i], ref);
    console.log(resultant);
    score.push({
      val: edit_distance_original - resultant,
      hypothesis: sentences[i],
    });
  }
  if (score.length == 0) {
    return {
      val: 0,
      hypothesis: hyp,
    };
  }
  let sortedScore = score.slice().sort((a, b) => b.val - a.val);
  console.log(sortedScore);
  if (sortedScore[0]["val"] == 0) {
    return {
      val: 0,
      hypothesis: hyp,
    };
  } else {
    return {
      val: sortedScore[0].val,
      hypothesis: sortedScore[0].hypothesis,
    };
  }
}

function TER(e) {
  e.preventDefault();
  let refr = document.getElementById("ref").value;
  let hypo = document.getElementById("hyp").value;
  let card = document.getElementById("crd");
  let hyp = hypo.split(" ");
  let ref = refr.split(" ");
  let edit = 0;
  while (1) {
    let { val, hypothesis } = shifting_op(hyp, ref);
    console.log(hypothesis);
    if (val <= 0) break;
    hyp = hypothesis;
    edit += 1;
  }
  console.log(edit);
  edit += edit_distance(hyp, ref);
  console.log(edit);
  card.style.display = "block";
  res.innerHTML = parseFloat(edit / ref.length);
  finalhyp.innerHTML = hyp.join(" ");
}

document.getElementById("btn").addEventListener("click", TER);
