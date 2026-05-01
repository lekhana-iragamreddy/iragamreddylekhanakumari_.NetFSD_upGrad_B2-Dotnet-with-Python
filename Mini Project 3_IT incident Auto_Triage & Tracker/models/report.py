class ReportGenerator:
    def generate_html(self, incidents):
        from collections import Counter
        from datetime import datetime
        import os

        type_count = Counter(i.type for i in incidents)
        severity_count = Counter(i.severity for i in incidents)
        team_count = Counter(i.assigned_team for i in incidents)

        total_incidents = len(incidents)
        critical_count = severity_count.get("critical", 0)
        high_count = severity_count.get("high", 0)
        security_count = type_count.get("security", 0)

        def badge(text, cls):
            return f'<span class="badge {cls}">{text}</span>'

        html = f"""
        <html>
        <head>
        <style>
            html, body {{
                height: auto;
                overflow-y: auto;
            }}

            body {{
                font-family: Segoe UI, Arial;
                background: #f5f7fb;
                margin: 20px;
            }}

            .header {{
                background: #1c3d6e;
                color: white;
                padding: 20px;
                border-radius: 8px;
                margin-bottom: 20px;
            }}

            .header h1 {{
                margin: 0;
                font-size: 26px;
            }}

            .header p {{
                margin: 5px 0 0;
                font-size: 14px;
            }}

            .card {{
                background: white;
                padding: 15px;
                margin-bottom: 15px;
                border-radius: 10px;
                box-shadow: 0 2px 6px rgba(0,0,0,0.1);
            }}

            .summary {{
                display: flex;
                gap: 15px;
                flex-wrap: wrap;
            }}

            .summary-box {{
                background: white;
                width: 130px;
                padding: 15px;
                border-radius: 10px;
                text-align: center;
                box-shadow: 0 2px 6px rgba(0,0,0,0.1);
            }}

            .summary-box h2 {{
                margin: 0;
                color: #1c3d6e;
            }}

            .summary-box p {{
                margin: 5px 0 0;
                font-size: 13px;
                color: #555;
            }}

            .badge {{
                padding: 5px 10px;
                border-radius: 20px;
                font-size: 12px;
                margin: 2px;
                display: inline-block;
            }}

            .network {{ background: #d0ebff; }}
            .security {{ background: #ffe3e3; }}
            .app {{ background: #e6fcf5; }}

            .critical {{ background: #ff4d4d; color: white; }}
            .high {{ background: #ffa94d; }}
            .medium {{ background: #ffd43b; }}
            .low {{ background: #69db7c; }}

            .table-container {{
                overflow-x: auto;
                margin-bottom: 50px;   /* ✅ prevents cut-off */
            }}

            table {{
                width: 100%;
                border-collapse: collapse;
                background: white;
            }}

            th {{
                background: #1c3d6e;
                color: white;
                padding: 10px;
                position: sticky;     /* ✅ nice improvement */
                top: 0;
            }}

            td {{
                padding: 8px;
                text-align: center;
            }}

            tr:nth-child(even) {{
                background: #f1f3f5;
            }}

            .ticket {{
                background: #e7f5ff;
                padding: 3px 6px;
                border-radius: 6px;
                font-size: 12px;
                margin: 2px;
                display: inline-block;
            }}
        </style>
        </head>

        <body>

        <div class="header">
            <h1>IT Incident Auto-Triage Report</h1>
            <p>Generated: {datetime.now().strftime('%Y-%m-%d %H:%M')} | Total Incidents: {total_incidents}</p>
        </div>

        <h2>Summary</h2>
        <div class="summary">
            <div class="summary-box">
                <h2>{total_incidents}</h2>
                <p>Total Incidents</p>
            </div>
            <div class="summary-box">
                <h2>{critical_count}</h2>
                <p>Critical</p>
            </div>
            <div class="summary-box">
                <h2>{high_count}</h2>
                <p>High</p>
            </div>
            <div class="summary-box">
                <h2>{security_count}</h2>
                <p>Security Incidents</p>
            </div>
        </div>

        <h2>Breakdown by Type</h2>
        <div class="card">
            {''.join([badge(f"{k}: {v}", k) for k,v in type_count.items()])}
        </div>

        <h2>Breakdown by Severity</h2>
        <div class="card">
            {''.join([badge(f"{k}: {v}", k) for k,v in severity_count.items()])}
        </div>

        <h2>Breakdown by Team</h2>
        <div class="card">
            {''.join([badge(f"{k}: {v}", "network") for k,v in team_count.items()])}
        </div>

        <h2>Incident Details</h2>

        <div class="table-container">
        <table>
        <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Severity</th>
            <th>Type</th>
            <th>Team</th>
            <th>Timestamp</th>
            <th>Tickets</th>
        </tr>
        """

        for inc in incidents:
            html += f"""
            <tr>
                <td>{inc.id}</td>
                <td>{inc.title}</td>
                <td><span class="badge {inc.severity}">{inc.severity.upper()}</span></td>
                <td><span class="badge {inc.type}">{inc.type}</span></td>
                <td>{inc.assigned_team}</td>
                <td>{inc.timestamp.strftime('%Y-%m-%d %H:%M')}</td>
                <td>
                    <span class="ticket">SNOW: {inc.ticket_ids.get('snow')}</span>
                    <span class="ticket">JIRA: {inc.ticket_ids.get('jira')}</span>
                    <span class="ticket">AZURE: {inc.ticket_ids.get('azure')}</span>
                </td>
            </tr>
            """

        html += "</table></div></body></html>"

        os.makedirs("output", exist_ok=True)

        with open("output/report.html", "w", encoding="utf-8") as f:
            f.write(html)