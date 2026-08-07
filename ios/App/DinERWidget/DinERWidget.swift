//
//  DinERWidget.swift
//  DinER iOS Minimal WidgetKit Extension
//

import WidgetKit
import SwiftUI

struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> SimpleEntry {
        SimpleEntry(date: Date(), netTotal: 841738, totalExpense: 2559223, currency: "COP")
    }

    func getSnapshot(in context: Context, completion: @escaping (SimpleEntry) -> ()) {
        let entry = SimpleEntry(date: Date(), netTotal: 841738, totalExpense: 2559223, currency: "COP")
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<Entry>) -> ()) {
        let defaults = UserDefaults(suiteName: "group.com.diner.app")
        let netTotal = defaults?.integer(forKey: "netTotal") ?? 841738
        let totalExpense = defaults?.integer(forKey: "totalExpense") ?? 2559223
        let currency = defaults?.string(forKey: "currency") ?? "COP"

        let entry = SimpleEntry(date: Date(), netTotal: netTotal, totalExpense: totalExpense, currency: currency)
        let nextUpdate = Calendar.current.date(byAdding: .minute, value: 15, to: Date())!
        let timeline = Timeline(entries: [entry], policy: .after(nextUpdate))
        completion(timeline)
    }
}

struct SimpleEntry: TimelineEntry {
    let date: Date
    let netTotal: Int
    let totalExpense: Int
    let currency: String
}

struct DinERWidgetEntryView : View {
    var entry: Provider.Entry

    var body: some View {
        ZStack {
            Color(red: 11/255, green: 11/255, blue: 13/255)
                .ignoresSafeArea()

            VStack(alignment: .leading, spacing: 10) {
                // Header Row
                HStack {
                    Text("DinER")
                        .font(.system(size: 14, weight: .black, design: .rounded))
                        .foregroundColor(.white)
                    Circle()
                        .fill(Color(red: 52/255, green: 199/255, blue: 89/255))
                        .frame(width: 6, height: 6)
                    Spacer()
                }

                Spacer()

                // Saldo Restante (Net Available Balance)
                VStack(alignment: .leading, spacing: 2) {
                    Text("Saldo Restante")
                        .font(.system(size: 11, weight: .bold, design: .rounded))
                        .foregroundColor(Color(red: 142/255, green: 142/255, blue: 147/255))

                    HStack(spacing: 4) {
                        Text("+")
                            .font(.system(size: 13, weight: .black))
                            .foregroundColor(.white)
                            .padding(.horizontal, 6)
                            .padding(.vertical, 2)
                            .background(Color(red: 52/255, green: 199/255, blue: 89/255))
                            .clipShape(Capsule())

                        Text("$\(entry.netTotal.formatted())")
                            .font(.system(size: 22, weight: .black, design: .rounded))
                            .foregroundColor(.white)
                    }
                }

                // Gasto del Mes (Total Expense)
                VStack(alignment: .leading, spacing: 2) {
                    Text("Gasto del Mes")
                        .font(.system(size: 11, weight: .bold, design: .rounded))
                        .foregroundColor(Color(red: 142/255, green: 142/255, blue: 147/255))

                    Text("- $\(entry.totalExpense.formatted()) \(entry.currency)")
                        .font(.system(size: 14, weight: .extrabold, design: .rounded))
                        .foregroundColor(Color(red: 232/255, green: 80/255, blue: 91/255))
                }
            }
            .padding(14)
        }
        .widgetURL(URL(string: "diner://add"))
    }
}

@main
struct DinERWidget: Widget {
    let kind: String = "DinERWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            DinERWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("DinER Minimal Widget")
        .description("Muestra tu Saldo Restante y el Gasto del Mes en un diseño minimalista.")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}
