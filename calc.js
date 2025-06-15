import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  'https://gfdkeutgojqefygoxnow.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmZGtldXRnb2pxZWZ5Z294bm93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4Mjk5NDksImV4cCI6MjA2NTQwNTk0OX0.vWQ70YA7egXTLg8glagWKhhjmIqpohxByA5Vgnv_eMk'
);

function Solve(val) {
  const res = document.getElementById("res");
  res.value += val;
}

function Clear() {
  document.getElementById("res").value = "";
}

function Back() {
  const res = document.getElementById("res");
  res.value = res.value.slice(0, -1);
}

async function Result() {
  const input = document.getElementById("res").value;
  try {
    const result = eval(input);
    document.getElementById("res").value = result;
    await simpanHistory(`${input} = ${result}`);
  } catch (error) {
    document.getElementById("res").value = "Error";
  }
}

async function simpanHistory(teks) {
  const { error } = await supabase.from("kalkulator").insert([{ history: teks }]);
  if (error) {
    console.error("Gagal menyimpan riwayat:", error.message);
  } else {
    muatHistory();
  }
}

async function hapusHistory(id) {
  const { error } = await supabase.from("kalkulator").delete().eq("id", id);
  if (error) {
    console.error("Gagal menghapus:", error.message);
  } else {
    muatHistory();
  }
}

async function hapusSemua() {
  const { error } = await supabase.from("kalkulator").delete().neq("id", 0); // hapus semua id
  if (error) {
    console.error("Gagal menghapus semua:", error.message);
  } else {
    muatHistory();
  }
}
async function muatHistory() {
    const { data, error } = await supabase.from("kalkulator").select("*").order("id", { ascending: false });
    const list = document.getElementById("historyList");
    list.innerHTML = "";
  
    if (error) {
      console.error("Gagal memuat:", error.message);
      return;
    }
  
    if (data.length === 0) {
      list.innerHTML = `<div class="text-gray-500 text-center py-4">Belum ada history.</div>`;
      return;
    }
  
    data.forEach((item) => {
      const div = document.createElement("div");
      div.className = "flex justify-between items-center p-2 border-b border-gray-300";
      div.innerHTML = `
        <span class="text-gray-800">${item.history}</span>
        <button class="bg-red-500 text-white rounded-lg px-2 py-1 hover:bg-red-600" onclick="hapusHistory(${item.id})">Hapus</button>
      `;
      list.appendChild(div);
    });
  }

window.Solve = Solve;
window.Clear = Clear;
window.Back = Back;
window.Result = Result;
window.hapusHistory = hapusHistory;
window.hapusSemua = hapusSemua;

muatHistory();
