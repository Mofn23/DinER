import WidgetKit
import SwiftUI

struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> SimpleEntry {
        SimpleEntry(date: Date(), balanceText: "$688.759 COP", statusText: "DinER Restante")
    }

    func getSnapshot(in context: Context, completion: @escaping (SimpleEntry) -> ()) {
        let entry = SimpleEntry(date: Date(), balanceText: "$688.759 COP", statusText: "DinER Restante")
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<Entry>) -> ()) {
        var entries: [SimpleEntry] = []

        // Read shared AppGroup data if available
        let userDefaults = UserDefaults(suiteName: "group.com.mofn.diner")
        let balance = userDefaults?.string(forKey: "diner_balance") ?? "$688.759 COP"

        let entry = SimpleEntry(date: Date(), balanceText: balance, statusText: "DinER Restante")
        entries.append(entry)

        let timeline = Timeline(entries: entries, policy: .atEnd)
        completion(timeline)
    }
}

struct SimpleEntry: TimelineEntry {
    let date: Date
    let balanceText: String
    let statusText: String
}

struct DinERWidgetEntryView : View {
    var entry: Provider.Entry
    @Environment(\.widgetFamily) var family

    var body: some View {
        ZStack {
            Color(red: 0.075, green: 0.075, blue: 0.075)

            VStack(alignment: .leading, spacing: 6) {
                HStack {
                    Text("DinER")
                        .font(.system(size: 14, weight: .black, design: .rounded))
                        .foregroundColor(Color(red: 0.204, green: 0.78, blue: 0.35))
                    Spacer()
                    Image(systemName: "creditcard.fill")
                        .font(.system(size: 12))
                        .foregroundColor(.gray)
                }

                Spacer()

                Text(entry.balanceText)
                    .font(.system(size: family == .systemSmall ? 20 : 28, weight: .black, design: .rounded))
                    .foregroundColor(.white)
                    .lineLimit(1)
                    .minimumScaleFactor(0.7)

                Text(entry.statusText)
                    .font(.system(size: 11, weight: .bold, design: .rounded))
                    .foregroundColor(Color.gray)
            }
            .padding()
        }
    }
}

@main
struct DinERWidget: Widget {
    let kind: String = "DinERWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            DinERWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("DinER Saldo Restante")
        .description("Muestra tu saldo disponible en tiempo real.")
        .supportedFamilies([.systemSmall, .systemMedium, .accessoryCircular, .accessoryInline])
    }
}
