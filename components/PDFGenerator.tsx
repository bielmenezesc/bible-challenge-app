import { loadReadingPlanFromStorage } from "@/scripts/bible-api";
import { loadNotes } from "@/scripts/notes-api";
import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

export async function exportAllNotesAsPDF(planName: string) {
  try {
    const plan = await loadReadingPlanFromStorage(planName);

    if (!plan?.length) {
      throw new Error("Plano inválido ou vazio.");
    }

    let html = `
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8" />
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 24px;
            background: #f9f9f9;
            color: #333;
          }

          h1 {
            text-align: center;
            color: #4a148c;
            margin-bottom: 40px;
          }

          h2 {
            background: #ede7f6;
            color: #4a148c;
            padding: 10px;
            border-radius: 6px;
            margin-top: 40px;
          }

          ul {
            list-style-type: none;
            padding: 0;
          }

          li {
            background: #ffffff;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 16px;
            box-shadow: 0 1px 4px rgba(0,0,0,0.06);
          }

          p {
            font-size: 16px;
            margin: 0 0 8px 0;
            line-height: 1.4;
          }

          time {
            font-size: 12px;
            color: #888;
          }
        </style>
      </head>
      <body>
        <h1>Suas Anotações da Bíblia</h1>
    `;

    for (const day of plan) {
      for (const chapter of day.referencesPt) {
        const notes = await loadNotes(chapter);

        if (notes && notes.length > 0) {
          html += `<h2>${chapter}</h2><ul>`;
          for (const note of notes) {
            const date = new Date(note.createdAt);
            const formattedDate = date.toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            });

            html += `
              <li id="${note.id}">
                <p>${note.content}</p>
                <time datetime="${note.createdAt}">${formattedDate}</time>
              </li>
            `;
          }
          html += `</ul>`;
        }
      }
    }

    html += `</body></html>`;

    if (html.includes(`<ul>`)) {
      const { uri } = await Print.printToFileAsync({ html, base64: false });

      const fileName = `Anotacoes_Biblia.pdf`;
      const destPath = `${FileSystem.documentDirectory}${fileName}`;

      await FileSystem.moveAsync({
        from: uri,
        to: destPath,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(destPath);
      } else {
        alert("PDF salvo em: " + destPath);
      }
    } else {
      alert("Nenhuma nota encontrada para exportar.");
    }
  } catch (error) {
    console.error("Erro ao exportar PDF:", error);
    alert("Erro ao exportar notas para PDF.");
  }
}
